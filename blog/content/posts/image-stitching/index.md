---
title: Image stitching (panoramic)
date: "2020-04-21"
description: "Create a montage by identifying images taken of the same scene and viewpoint"
---

In this blog we take look at a script I wrote which determines if images are taken of
the same scene, and if so stitch them together to create a nice image montage/panoramic.

## SIFT Keypoint extraction

For keypoint extraction I decided to go with SIFT(Scale-Invariant Feature Transform).
I found SIFT to be the easiest to understand and a great introduction to key point
extraction. There are of course alternatives such as SURF, BRISK and FREAK.

### Scale-space extrema detection

Extrema points are most likely key points, and to be scale invariant we must search
for stable points across multiple scales.

To do this SIFT utilizes an image pyramid, where each level(octave) is derived 
from applying some function to the image below.

For example the following image shows a image pyramid which applies the mean function
at each level

![mean pyramid](./mean-pyramid.png)

For SIFT at each level we apply the Difference of Gaussian kernel which is a fast 
approximation to scale normalized Laplacian of Gaussian. After each level the
Gaussian image is down sampled by a factor of 2 or 1/4th the orginal size. See below
for illustration.

![sift DOG](./sift-dog.jpg)

Once the Difference of Gaussian image pyramid has been computed, the pyramid is
searched for local extrema over scale and space. A point is local in our case when 
compared with its 8-connected neighbours, 9 pixels from above and 9 pixels from below.

![sift local extrema](./sift-local-extrema.jpg)

#### Keypoint localization

For each keypoint candidate position interpolation is done using Taylor expansion of
the the Difference of Gaussian scale space function with the keypoint as its origin,
we refer to this as D(x).
If the intensity at the candidate extrema is less than the 0.03 threshold value
stated in the David Lowe paper, it is rejected.

Difference of Gaussian often has a high response to edges. In order to increase
stablility, we seek to remove candidate keypoints that have poorly determined 
locations but high edge response. 

To do this a 2x2 Hessian matrix is used to compute the principal curvature of D(x).
The result are two eigen values lets call them alpha and beta which are proportional
to the principal curvatures of D(x).

Key points with poorly defined peaks in the Difference of Gaussian function have 
larger principal curvature across the edge than along it. Thus we can form a ratio
with the alpha and beta eigen values to use as a threshold, in the paper this
threshold value is defined as 10.

#### Keypoint orientation

To achieve rotation invariance we must assign the keypoint with a orientation. We
first construct a histogram with 36 bins which covers 360 degrees around our
keypoint, next we calculate the gradient magnitude and direction of the neighboring
pixels and add them to the histogram.

The orientations within 80% of the highest peaks are assigned to the keypoint. For each
additional orientation assigned additional keypoints are created having the same position 
and scale as the original keypoint.

#### Keypoint descriptor

Now that we have a set of keypoints that are both scale and orientation invariant.
We need to generate unique "signatures" for these keypoints. To produce this
signature we take a 16x16 pixel block around the keypoint. This block is then equally
divided into 4x4 sub-blocks and for each of these 4x4 sub-blocks a 8 bin oreintation
histogram is creaded.

In total this gives us 128 values, which is represented as a vector to form the
unique keypoint descriptor.

The following is an illustration on how keypoint descriptor works. Note that instead
of a 16x16 block, the image shows a 8x8 block divided into 4x4 sub-blocks.

![keypoint descriptor](./keypoint-desc.png)

## Feature matching with FLANN

Still working on this ...


