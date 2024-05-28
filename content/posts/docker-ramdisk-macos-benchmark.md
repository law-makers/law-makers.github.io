---
title: "Improve docker volume performance on MacOS with a RAM disk"
date: "2022-06-27"
Description: "How to improve docker volume performance on MacOS"
draft: false
---

- [Primer](#primer)
- [Hardware](#hardware)
- [Setup](#setup)
- [Random Read and write performance](#random-read-and-write-performance)
  - [Standard volume](#standard-volume)
  - [RAM Disk](#ram-disk)
- [I/0 latency](#i0-latency)
  - [Standard volume](#standard-volume-1)
  - [RAM Disk](#ram-disk-1)
- [Cleanup](#cleanup)
- [Results](#results)

# Primer

Whilst docker does support [tmpfs](https://docs.docker.com/storage/tmpfs/) natively, it's only available if you're running docker on linux. A use-case for using a ram disk, as described in the documentation:

> If your container generates non-persistent state data, consider using a tmpfs mount to avoid storing the data anywhere permanently, and to increase the container’s performance by avoiding writing into the container’s writable layer.

However, we can still create a RAM disk in MacOS and mount it within docker. I'll mount a RAM disk and a standard docker volume and measuring the performance of both to compare.

# Hardware

My M1 Macbook Air's current sysinfo (unrelated info redacted)

```bash
$  system_profiler SPSoftwareDataType SPHardwareDataType SPNVMeDataType
Software:

    System Software Overview:

      System Version: macOS 12.4 (21F79)
      Kernel Version: Darwin 21.5.0
      Boot Volume: Macintosh HD
      Boot Mode: Normal
      Computer Name: <REDACTED>
      User Name: <REDACTED>
      Secure Virtual Memory: Enabled
      System Integrity Protection: Enabled
      Time since boot: <REDACTED>

Hardware:

    Hardware Overview:

      Model Name: MacBook Air
      Model Identifier: MacBookAir10,1
      Chip: Apple M1
      Total Number of Cores: 8 (4 performance and 4 efficiency)
      Memory: 16 GB
      System Firmware Version: 7459.121.3
      OS Loader Version: 7459.121.3
      Serial Number (system): <REDACTED>
      Hardware UUID: <REDACTED>
      Provisioning UDID: <REDACTED>
      Activation Lock Status: Enabled

NVMExpress:

    Apple SSD Controller:

        APPLE SSD AP1024Q:

          Capacity: 1 TB (1,000,555,581,440 bytes)
          TRIM Support: Yes
          Model: APPLE SSD AP1024Q
          Revision: 387.120.
          Serial Number: <REDACTED>
          Detachable Drive: No
          BSD Name: disk0
          Partition Map Type: GPT (GUID Partition Table)
          Removable Media: No
          S.M.A.R.T. status: Verified
          Volumes:
            disk0s1:
              Capacity: 524.3 MB (524,288,000 bytes)
              BSD Name: disk0s1
              Content: Apple_APFS_ISC
            disk0s2:
              Capacity: 994.66 GB (994,662,584,320 bytes)
              BSD Name: disk0s2
              Content: Apple_APFS
            disk0s3:
              Capacity: 5.37 GB (5,368,664,064 bytes)
              BSD Name: disk0s3
              Content: Apple_APFS_Recovery

```

# Setup

First we create a regular folder within the NVMe mount to test the standard docker volume

```bash
mkdir ~/docker-test-volume/
```

Now we create a RAM disk on MacOS, in this case it will be 2GBs

```bash
diskutil erasevolume HFS+ 'ramdisk' $(hdiutil attach -nobrowse -nomount ram://4194304`)`
Started erase on disk7
Unmounting disk
Erasing
Initialized /dev/rdisk7 as a 2 GB case-insensitive HFS Plus volume
Mounting disk
Finished erase on disk7 (ramdisk)
```

Now we'll create an `alpine` docker container mounting both volumes and install the required benchmarking software

```bash
docker run -v "${HOME}/docker-test-volume/:/std-volume" -v "/Volumes/ramdisk/:/ramdisk" -it alpine sh
```

# Random Read and write performance

We'll be using [fio](https://github.com/axboe/fio) for benchmarking read/write performance

```bash
apk add ioping
```

## Standard volume

```bash
/std-volume # fio --randrepeat=1 --ioengine=libaio --direct=1 --gtod_reduce=1 --name=test --filename=test --bs=4k --iodepth=64 --size=1G --readwrite=randrw --rwmixread=75
test: (g=0): rw=randrw, bs=(R) 4096B-4096B, (W) 4096B-4096B, (T) 4096B-4096B, ioengine=libaio, iodepth=64
fio-3.28
Starting 1 process
test: Laying out IO file (1 file / 1024MiB)
Jobs: 1 (f=1): [m(1)][97.0%][r=34.2MiB/s,w=11.7MiB/s][r=8766,w=2996 IOPS][eta 00m:01s]
test: (groupid=0, jobs=1): err= 0: pid=16: Mon Jun 27 23:20:11 2022
  read: IOPS=6159, BW=24.1MiB/s (25.2MB/s)(768MiB/31900msec)
   bw (  KiB/s): min= 2756, max=43405, per=99.89%, avg=24613.37, stdev=4898.59, samples=63
   iops        : min=  689, max=10851, avg=6153.08, stdev=1224.62, samples=63
  write: IOPS=2057, BW=8231KiB/s (8429kB/s)(256MiB/31900msec); 0 zone resets
   bw (  KiB/s): min=  972, max=14605, per=99.90%, avg=8223.41, stdev=1703.56, samples=63
   iops        : min=  243, max= 3651, avg=2055.63, stdev=425.84, samples=63
  cpu          : usr=2.60%, sys=14.09%, ctx=327802, majf=0, minf=14
  IO depths    : 1=0.1%, 2=0.1%, 4=0.1%, 8=0.1%, 16=0.1%, 32=0.1%, >=64=100.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.1%, >=64=0.0%
     issued rwts: total=196498,65646,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=64

Run status group 0 (all jobs):
   READ: bw=24.1MiB/s (25.2MB/s), 24.1MiB/s-24.1MiB/s (25.2MB/s-25.2MB/s), io=768MiB (805MB), run=31900-31900msec
  WRITE: bw=8231KiB/s (8429kB/s), 8231KiB/s-8231KiB/s (8429kB/s-8429kB/s), io=256MiB (269MB), run=31900-31900msec
```

## RAM Disk

```bash
/ramdisk # fio --randrepeat=1 --ioengine=libaio --direct=1 --gtod_reduce=1 --name=test --filename=test --bs=4k --iodepth=64 --size=1G --readwrite=randrw --rwmixread=75
test: (g=0): rw=randrw, bs=(R) 4096B-4096B, (W) 4096B-4096B, (T) 4096B-4096B, ioengine=libaio, iodepth=64
fio-3.28
Starting 1 process
test: Laying out IO file (1 file / 1024MiB)
Jobs: 1 (f=1): [m(1)][100.0%][r=59.7MiB/s,w=20.3MiB/s][r=15.3k,w=5206 IOPS][eta 00m:00s]
test: (groupid=0, jobs=1): err= 0: pid=19: Mon Jun 27 23:23:03 2022
  read: IOPS=13.6k, BW=53.3MiB/s (55.9MB/s)(768MiB/14396msec)
   bw (  KiB/s): min=19832, max=65368, per=99.48%, avg=54313.21, stdev=9848.89, samples=28
   iops        : min= 4958, max=16342, avg=13578.14, stdev=2462.20, samples=28
  write: IOPS=4560, BW=17.8MiB/s (18.7MB/s)(256MiB/14396msec); 0 zone resets
   bw (  KiB/s): min= 6728, max=22208, per=99.50%, avg=18149.14, stdev=3321.62, samples=28
   iops        : min= 1682, max= 5552, avg=4537.14, stdev=830.41, samples=28
  cpu          : usr=6.59%, sys=33.55%, ctx=327779, majf=0, minf=14
  IO depths    : 1=0.1%, 2=0.1%, 4=0.1%, 8=0.1%, 16=0.1%, 32=0.1%, >=64=100.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.1%, >=64=0.0%
     issued rwts: total=196498,65646,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=64

Run status group 0 (all jobs):
   READ: bw=53.3MiB/s (55.9MB/s), 53.3MiB/s-53.3MiB/s (55.9MB/s-55.9MB/s), io=768MiB (805MB), run=14396-14396msec
  WRITE: bw=17.8MiB/s (18.7MB/s), 17.8MiB/s-17.8MiB/s (18.7MB/s-18.7MB/s), io=256MiB (269MB), run=14396-14396msec

```

# I/0 latency

We also can use [IOPing](https://github.com/koct9i/ioping) to monitor I/O latency in real time, as a basic heuristic.

```bash
apk add ioping
```

## Standard volume

```bash
/std-volume # ioping -c 10 .
4 KiB <<< . (virtiofs virtiofs0 926.4 GiB): request=1 time=78.3 us (warmup)
4 KiB <<< . (virtiofs virtiofs0 926.4 GiB): request=2 time=396.4 us
4 KiB <<< . (virtiofs virtiofs0 926.4 GiB): request=3 time=369 us
4 KiB <<< . (virtiofs virtiofs0 926.4 GiB): request=4 time=322.9 us
4 KiB <<< . (virtiofs virtiofs0 926.4 GiB): request=5 time=254.2 us
4 KiB <<< . (virtiofs virtiofs0 926.4 GiB): request=6 time=369.7 us
4 KiB <<< . (virtiofs virtiofs0 926.4 GiB): request=7 time=284 us
4 KiB <<< . (virtiofs virtiofs0 926.4 GiB): request=8 time=316.2 us
4 KiB <<< . (virtiofs virtiofs0 926.4 GiB): request=9 time=389.7 us
4 KiB <<< . (virtiofs virtiofs0 926.4 GiB): request=10 time=308.2 us

--- . (virtiofs virtiofs0 926.4 GiB) ioping statistics ---
9 requests completed in 3.01 ms, 36 KiB read, 2.99 k iops, 11.7 MiB/s
generated 10 requests in 9.00 s, 40 KiB, 1 iops, 4.44 KiB/s
min/avg/max/mdev = 254.2 us / 334.5 us / 396.4 us / 46.5 us
```

## RAM Disk

```bash
/ramdisk # ioping -c 10 .
4 KiB <<< . (virtiofs virtiofs1 2 GiB): request=1 time=63.3 us (warmup)
4 KiB <<< . (virtiofs virtiofs1 2 GiB): request=2 time=201.5 us
4 KiB <<< . (virtiofs virtiofs1 2 GiB): request=3 time=204.0 us
4 KiB <<< . (virtiofs virtiofs1 2 GiB): request=4 time=327.4 us
4 KiB <<< . (virtiofs virtiofs1 2 GiB): request=5 time=297.5 us
4 KiB <<< . (virtiofs virtiofs1 2 GiB): request=6 time=202.9 us
4 KiB <<< . (virtiofs virtiofs1 2 GiB): request=7 time=390.1 us (slow)
4 KiB <<< . (virtiofs virtiofs1 2 GiB): request=8 time=288.0 us
4 KiB <<< . (virtiofs virtiofs1 2 GiB): request=9 time=311.8 us
4 KiB <<< . (virtiofs virtiofs1 2 GiB): request=10 time=381.5 us

--- . (virtiofs virtiofs1 2 GiB) ioping statistics ---
9 requests completed in 2.60 ms, 36 KiB read, 3.46 k iops, 13.5 MiB/s
generated 10 requests in 9.00 s, 40 KiB, 1 iops, 4.44 KiB/s
min/avg/max/mdev = 201.5 us / 289.4 us / 390.1 us / 69.2 us
```

# Cleanup

To remove the RAMdisk

```bash
$ diskutil unmount /dev/disk7
Volume ramdisk on disk7 unmounted
$ diskutil unmountDisk /dev/disk7
Unmount of all volumes on disk7 was successful
```

# Results

Note that the tests are somewhat cursory, but from what we have the read/write IOPS are double with the RAM disk, and latency is slightly improved.
