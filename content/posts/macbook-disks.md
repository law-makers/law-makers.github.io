---
title: "M1 MacBooks and Drive Wear"
date: "2021-11-17"
description: "M1 MacBooks and Drive Wear"
draft: false
---

Typically, to find the overall wear of a MacBook drive, one installs `smartctl` from [smartmontools](http://www.smartmontools.org/) via `brew install smartmontools` or `sudo port install smartmontools`

Then by looking at the `Percentage Used` from the output of `smartctl -a /dev/disk0`

```text
=== START OF SMART DATA SECTION ===
SMART overall-health self-assessment test result: PASSED

SMART/Health Information (NVMe Log 0x02)
Critical Warning:                   0x00
Temperature:                        39 Celsius
Available Spare:                    100%
Available Spare Threshold:          99%
Percentage Used:                    0%
Data Units Read:                    48,035,261 [24.5 TB]
Data Units Written:                 31,532,520 [16.1 TB]
Host Read Commands:                 809,807,603
Host Write Commands:                409,470,021
Controller Busy Time:               0
Power Cycles:                       123
Power On Hours:                     564
Unsafe Shutdowns:                   12
Media and Data Integrity Errors:    0
Error Information Log Entries:      0
```

Or as a one-liner

`smartctl -a /dev/disk0 | awk -F ':' '/Percentage Used:/{gsub(/ /, "", $2); print $2}'`

In my case it's `0%`, but what exactly does `Percentage Used` mean? These [Kingston](https://media.kingston.com/support/downloads/MKP_521.6_SMART-DCP1000_attribute.pdf) and [nvmexpress.com's](https://www.nvmexpress.org/wp-content/uploads/NVM_Express_Management_Interface_1_0a_2017.04.08_-_gold.pdf) documents shed some light

> Percentage Used: Contains a vendor specific estimate of the percentage of NVM subsystem life used
> based on the actual usage and the manufacturer’s prediction of NVM life. A value of 100 indicates that
> the estimated endurance of the NVM in the NVM subsystem has been consumed, but may not indicate
> an NVM subsystem failure. The value is allowed to exceed 100. Percentages greater than 254 shall be
> represented as 255. This value shall be updated once per power-on hour (when the controller is not in a
> sleep state).
> Refer to the JEDEC JESD218A standard for SSD device life and endurance measurement techniques.

My hunch is that it's probably related to `Data Units Read` and `Data Units Written` given how often MacOS swaps, but since the attribute is vendor specific it may be misinterpreted, I suppose time will tell whether these new soldered-on SSD MacBooks will become bricks.
