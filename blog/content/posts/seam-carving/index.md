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

In 2007 a paper titled "Seam Carving for Content-Aware Image Resizing" was published, which suggested
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

Now that we have a general understanding of what Content-Aware Image Resizing is, lets take a look at how 
exactly these seams are selected.

The seam we select to be removed, is the seam with the least energy. Energy is defined in our case
as the derivative magnitudes at each pixel.

![energy def](./energy.png)

Below is a python snippit that calculates image energy using the <a href="https://en.wikipedia.org/wiki/Sobel_operator" target = "_blank">Sobel kernel</a>.

```python
def calc_energy(img):#function calculates image energy
    #calculate energy of image, first convert to greyscale then apply sobel
    gray_scale = cv2.cvtColor(img.astype(np.uint8), cv2.COLOR_BGR2GRAY)
    sobelx = cv2.Sobel(gray_scale,cv2.CV_64F,1,0,ksize=3)
    sobely = cv2.Sobel(gray_scale,cv2.CV_64F,0,1,ksize=3)
    img_energy = np.abs(sobelx) + np.abs(sobely)
    return img_energy
```

The optimal vertical seam to be removed is thus the seam which minimizes this energy.

![optimal energy seam](./min-seam.png)

Given the exponential number of potential seams, a brute force solution is not desirable.
Examining the problem a bit further we can see that this is a classic dynamic programming problem,
which would allow use to solve for the minimal seam at linear time.

This dynamic programming problem can be defined as the following, where ``W[i,j]`` is the seam cost
function at each pixel.

![optimal energy seam](./dyn-prog.png)

Below is the dynamic programming code, note how we set energy of the left and right edges to 1 million,
this is done to prevent the seams from going out of bounds.

```python
def min_helper(left,right,center):
    lrcMatrix = np.stack((left,right,center), axis = 0)
    return np.min(lrcMatrix,axis=0)

def cumulative_energy(img_energy):
    row, col = img_energy.shape[:2]
    cumulative_energy = np.zeros((row, col))
    cumulative_energy[0,:] = img_energy[0,:]
    #set leftmost and right most col to 1mill
    cumulative_energy[0,0] = 1e6 
    cumulative_energy[0,-1] = 1e6
    for i in range(1, row):
        cumulative_energy[i-1,0] = 1e6 #set leftmost and right most col to 1mill
        cumulative_energy[i-1,-1] = 1e6
        #split into left right and center left = cumulative_energy[i-1, :-2] right = cumulative_energy[i-1, 2:]
        center = cumulative_energy[i-1, 1:-1]
        mins = min_helper(left,right,center) #call min helper returns array of mins
        cumulative_energy[i,:] = img_energy[i,:] #set self energy value
        cumulative_energy[i,1:-1] = cumulative_energy[i,1:-1] + mins
        #set leftmost and right most col to 1mill
        cumulative_energy[i,0] = 1e6 
        cumulative_energy[i,-1] = 1e6
    return cumulative_energy
```
Once we have calculated ``W``, we need to back trace to find the actual path of the seam. To do this 
we first find the column in the last row with the minimum cost, this becomes our end point of the seam.
From this point we trace back one row at a time picking the minumum value all the way to the top.

This is defiend by the following.

![back trace](./backtrk.png)

The following is the python code snippit for seam back tracing.
```python
def seam_backtrace(cumlative_energy):
    row, col = cumlative_energy.shape[:2]
    seam = []
    prev_pos = 0
    for i in range(row-1, -1, -1):#need to iterate backwards to trace down path
        cur_row = cumlative_energy[i,:]#the row we are looking at currently
        if i == row -1: #if last row, then argmin is our starting point
            prev_pos = np.argmin(cur_row)
            seam.append([prev_pos, i])
        else:
            if(prev_pos - 1 < 0):
                left = 1e6
            else:
                left = cur_row[prev_pos - 1]
            if(prev_pos + 1 > col):
                right = 1e6
            else:
                right = cur_row[prev_pos + 1]
            middle = cur_row[prev_pos]
            prev_pos = prev_pos + np.argmin([left, middle, right]) - 1
            seam.append([prev_pos, i])
    #little clean up 
    seam = np.asarray(seam)#set as np array
    seam = seam[::-1]#reverse the array
    return seam
```
## Results
The following are the results of seam carving resizing and simple resizing shown side by side.

![snow final](./snow-sbs.png)

![lib final](./lib-sbs.png)
