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

There are two common methods for feature matching, brute force matching and FLANN.

Brute force matching performs an exhaustive search and guarantees the best match,
but this comes at the cost of being extremely slow.

FLANN or "Fast Library for Approximate Nearest Neighbors" like its name suggest is
fast but does not gaurntee the best match instead provides the approximate best
match. To achive its speed FLANN stores the key points in a 
[k-d tree](https://en.wikipedia.org/wiki/K-d_tree), which is a special cases of 
binary space partitioning trees. Once all the key points are inserted into the k-d 
tree, k-nearest neighbors algorithm is ran with k set to 2.

This returns the best match and second best match, their similarities are then
compared via a ratio test. If the result is a high ratio this would suggest that the
best match is not unique and maybe a part of a repeated pattern, thus we should 
discard the pair. If on the other hand we obtain a pair with a ratio that falls 
within our threshold this would suggest that the best match is unique.

## CODE: keypoint matching

```python
#SIFT(read note on SIFT patent)
sift = cv2.xfeatures2d.SIFT_create()
kpt1, des1 = sift.detectAndCompute(img1,None)
kpt2, des2 = sift.detectAndCompute(img2,None)
#FLANN key point matching
FLANN_INDEX_KDTREE = 0
index_params = dict(algorithm = FLANN_INDEX_KDTREE, trees = 5)
search_params = dict(checks = 50)
flann = cv2.FlannBasedMatcher(index_params, search_params)
matches = flann.knnMatch(des1, des2, k =2)
#Finding good matches
good = []
pts1 = []
pts2 = []
for i, j in matches:
    if i.distance < 0.8*j.distance:
        good.append([i])
        pts2.append(kpt2[i.trainIdx].pt)
        pts1.append(kpt1[i.queryIdx].pt)
#Return image with matched keypoints highlighted
good = np.array(good)
pts1 = np.array(pts1)
pts2 = np.array(pts2)
print('Matches found: %d'%(good.shape[0]))
out = cv2.drawMatchesKnn(img1, kpt1, img2, kpt2, good, None, flags =2)
cv2.imwrite(img_out+"_match_init.jpg", out)
```
### Note on SIFT patent

Since OpenCV 3.4.3 SIFT and SURF algorithms have been moved behind a
``OPENCV_ENABLE_NONFRE`` flag. This is due to SIFT being patented and thus cannot
be legally distributed under OpenCV's MIT license.

There are two workarounds for this. One is to roll back to a version before this
change was pushed out. Second solution is to compile OpenCV yourself with the 
``OPENCV_ENABLE_NONFREE=1`` enabled. You can read more about it here [OpenCV #126](https://github.com/skvark/opencv-python/issues/126).

According to the [SIFT patent](https://patents.google.com/patent/US6711293B1/en) it
is set to expire on 03/06/2020. A [Github issue](https://github.com/opencv/opencv/issues/16736) has already been opened to move SIFT back into the main repository.

## Fundamental matrix

The next step in our process is to calculate the fundamental matrix. To understand 
what the fundamental matrix is and why its important, we need to take a look at 
epipolar geometry. 

![Epipolar geometry](./epipolar.png)

The image above depicts a typical stereo vision scenario, where two optical 
sensors(``O1`` and ``O2``) are observing an object ``P``, these three points together
forms the epipolar plane(grey area). The projection of ``P`` on to each image planes
is represented as ``p`` and ``p'``.

The orange line connecting the two image sensors is referred to as the baseline, the
locations where the baseline intersects the two image planes are know as the 
epipoles(``e`` and ``e'``), and the intersection of the epipolar plane and the two
image planes are know as the epipolar lines(blue lines).

Fundamental matrix is a 3x3 homogeneous matrix that encodes information about the
camera matrices, relative translation and relative rotation between cameras thus
allows us to use epipolar geometry to deduce relations between images pairs without 
knowing all the constraints. In other words if we know the fundamental matrix, then 
any point in one image allows us to calculate the epipolar line of the respective 
point in the other image.






