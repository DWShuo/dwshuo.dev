---
title: Content aware image resizing (seam carving)
date: "2019-09-17"
description: "Resize images while keeping main subject focused and undistorted"
---

Ordinarily when a image is resized each pixel is treated equally, meaning everthing gets
reduced or increased by the same amount. This leads to weird distortions to the subject of
the image.

For example the following is a image of a skier and a helicopter.

![snow original](./snow.png)

If we were to resize it so that its a square we would see heavy distortions around the main 
subjects of the image.

![snow bad](./snow-bad.png)

## Content-Aware Image Resizing

In 2007 a paper was published titled "Seam Carving for Content-Aware Image Resizing", which suggest
resizing along seams of low energy. A vertical seam is defined in this case as one pixel per row and 
each pixel being 8-connected (pixels in adjacent rows differ by at most one column).

Formally a vertical seam of a M rows by N columns can be defined as. Where ``i`` is the row and ``c(i)``
is the chosen column in each row.

![seam def](./seam-def.png)

Once we have selected a seam, the pixels on the seam are then removed from the orginal image, and the rest
shifted over to fill in the blank spaces. This will then create a new M rows by N-1 columns image.

Below is an example of a vertical seam.

![snow seam](./snow_seam.png)

## Selecting seams
