import cv2
import os
from decord import VideoReader, cpu, gpu
import numpy as np
import tensorflow as tf

def gpu_exists():
    return tf.test.is_gpu_available()

def extract_frames(video_path: str, output_dir:"temp/frames", max_frames=12):
    os.makedirs(output_dir, exist_ok = True)
    
    if gpu_exists():
        vr = VideoReader(video_path, ctx=gpu(0))  
    else:
        vr = VideoReader(video_path, ctx=cpu(0))
    total_frames = len(vr)

    # sample frames uniformly as baseline
    uniform_indices = np.linspace(0, total_frames - 1, num=max_frames, dtype=int)

    frames = []
    prev_gray = None
    saved = 0

    for i in range(total_frames):
        frame = vr[i].asnumpy()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        capture = False

        # change in scene detection
        if prev_gray is not None:
            diff = cv2.absdiff(gray, prev_gray)
            non_zero_count = np.count_nonzero(diff)
            if non_zero_count > 0.01 * diff.size:  # if 1% change in pixels
                capture = True

            # uniform callback sampling
            if i in uniform_indices:
                capture = True
            
            if capture and saved < max_frames:
                path = os.path.join(output_dir, f"frame_{saved:03d}.jpg")
                cv2.imwrite(path, frame)
                frames.append(path)
                saved += 1
            
            prev_gray = gray

            if saved >= max_frames:
                break

    return frames