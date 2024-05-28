---
title: "Kube Tricks"
date: "2021-11-10"
draft: false
---

## Ephemeral Debug Containers

One can use [ephemeral debug containers](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-running-pod/#ephemeral-container)

Alternatively to edit in-place to test out configs and env vars use `kubectl edit` to modify a pod (or `Deployment`, `StatefulSet` etc.) YAML to update the command to do nothing so one can `kubectl exec` into the pod

```YAML
apiVersion: v1
kind: Pod
metadata:
  name: unstable-pod
spec:
  containers:
  - name: unstable-pod
    image: foobar
    command:
    - sh
    - -c
    - "tail -f /dev/null"
```

Ensure `liveness` and `readiness` probes are commented out if it depends on a runtime condition.

## Utilising [podmanagementpolicy](https://kubernetes.io/docs/tutorials/stateful-application/basic-stateful-set/#pod-management-policy)

Mostly used for `StatefulSets`. Setting `podManagementPolicy: "Parallel"` means the ordered pods will run and be terminated in parallel. Useful for when one doesn't care about pods starting serially, in order. Keep in mind, if a broken deployment is scaled with `n` pods, there will be an `n` amount of `CrashLoopBackOffs` in parallel.

## Defaulting to Retain `PVCs`

For example, creating a `StorageClass` (e.g., if GCP is the provider)

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard-pd-retain
provisioner: kubernetes.io/gce-pd
reclaimPolicy: Retain
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
parameters:
  type: pd-standard
```

Where `reclaimPolicy: Retain` ensures if `PVs` are deleted, on the storage backed side (EBS, GCP Disks etc.) are preserved. The general idea is not to let Kubernetes actually delete any data, the `PV` will disappear but the volume will still persist outside of Kubernetes. This is useful when one accidentally deletes a `PV`, since it can be reattached to a new `PVC` for recovery (I’ve had to do this unfortunately).

## Debugging Methods

When something goes awry, and sometimes there isn't sophisticated monitoring already set up because there isn't enough time to build it yet—so one will probably need to get familiar with checking the right places, especially if an issue is urgent.

For example if something is broken and it’s not immediately obvious if it’s an application or a cluster-wide issue, a good order to deep-dive into things would be:

- Go by the first hunch and follow that (as one is naturally inclined to do). After a while one will learn the general pitfalls, or have built intuition.
- Start by running `kubectl describe` on the pods that have issues and check the `events`.
- Run `kubectl get events` in the namespace. Then `kubectl get events --sort-by=.metadata.creationTimestamp` and inspect.
- Check `kubectl get pods -o wide` to see which node the pod is running on. Then `kubectl describe nodes` to see if there are issues with the particular node (or any others).
- If it’s an issue with `PVCs`, check the persistent volumes since they sometimes get lost, via `kubectl get pv` or `kubectl describe pv`. If `PVs` are stuck as `Terminating`, edit the `PV` and delete the `Finalizers`.
- If it’s a performance issue, use `watch -n5 kubectl top nodes` (or `kubectl top pods`) and inspect.
- If it’s a scaling issue check `autoscaler kubectl -n kube-system logs -f deployment.apps/cluster-autoscaler`.
- If it’s a networking issue check the Kubernetes DNS. In certain infra configurations `kube-dns` pods can be scheduled on only one node (sometimes a preemptible or spot node), guaranteeing downtime.
- Check the VMs on the cloud provider if it's a compute issues, or the disk if it’s a storage issue. Sometimes it's preemptible/spot nodes going down (or the general provider itself)
  Usually the problem will emerge. Normally one doesn't often need to directly connect to the VM.

## `StatefulSets` are more trouble than they're worth

`StatefulSets` have their place, but in my opinion they’re not ideal when one really wants to principally keep state. Useful for general compute pods where it’s good to keep state between pod restarts and the like. But in situations where on is running a properly stateful service like `HDFS` or `ES`, a `Deployment` + `PVC` is almost always better. Here are some comparisons, say for a `HDFS` (namenode) pod with `n` datanodes:

- If one wants to remove ; number 4 of n in a `StatefulSet`, one has to scale them down since they’re ordered
- If one wants to migrate the `PVs` to a different cluster, it's non-trivial since `volumeClaimTemplates` will create new `PVCs` + `PVs`
- If one accidentally delete the `StatefulSet`, the `volumeClaimTemplates` is removed, and non-trivial to reattach `PVs` (if they were set to `Retain`).
- One can't have datanodes in a `StatefulSet` that have different `PVC` sizes, requests, env vars, or anything useful. They stay identical.

## Using `kubectl diff` and `validate --dry-run`

Both useful for CI, but generally a good idea to check the `diff` of a resource that's about to updated.

## Switch Namespaces and Clusters Faster

Tools like [kubectx + kubens](https://github.com/ahmetb/kubectx) are useful to switch between different clusters and namespaces faster. Renaming both binaries to `kcontext` and `knamespace` is another neat trick to make `kubectl` autocomplete.

## Keeping it Simple

Personally, I prefer `kustomize` + `envsubst` + `python` to template via `overlays`. I’m not into templating YAML (kustomize is advertised as "template-free" templating, but it's still somewhat `YAML HELL` like many things).

Personally I avoid using helm (messy configs, more moving parts, black box, the "package management" isn't a feature for me for infra code), or try not to i.e., generate `YAMLs` from a chart and use them. I try not use use too many Kubernetes operators or `CRDs`, generally keeping things stock and primitive. Of course complexity is always difficult to manage, so compromises are made. Programatically generating Kubernetes manifests is a good engineering idea, but probably overkill for many teams.
