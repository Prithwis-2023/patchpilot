import cv2
import os
from decord import VideoReader, cpu, gpu
import numpy as np

def extract_frames(video_path: str, output_dir: str = "temp/frames", max_frames: int = 12):
    os.makedirs(output_dir, exist_ok=True)
    
    # Try GPU first, fallback to CPU
    try:
        vr = VideoReader(video_path, ctx=gpu(0))
    except:
        vr = VideoReader(video_path, ctx=cpu(0))
    
    total_frames = len(vr)
    
    if total_frames == 0:
        return []

    # Sample frames uniformly as baseline
    uniform_indices = np.linspace(0, total_frames - 1, num=max_frames, dtype=int)

    frames = []
    prev_gray = None
    saved = 0

    for i in range(total_frames):
        frame = vr[i].asnumpy()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        capture = False

        # Always set prev_gray for next iteration
        if prev_gray is None:
            prev_gray = gray
            # First frame: always capture
            capture = True
        else:
            # Change in scene detection
            diff = cv2.absdiff(gray, prev_gray)
            non_zero_count = np.count_nonzero(diff)
            if non_zero_count > 0.01 * diff.size:  # if 1% change in pixels
                capture = True

        # Uniform sampling: always include uniform samples
        if i in uniform_indices:
            capture = True
        
        if capture and saved < max_frames:
            path = os.path.join(output_dir, f"frame_{saved:03d}.jpg")
            cv2.imwrite(path, frame)
            frames.append(path)
            saved += 1
        
        # Always update prev_gray
        prev_gray = gray

        if saved >= max_frames:
            break

    # Ensure we have at least some frames (uniform samples)
    if len(frames) == 0 and total_frames > 0:
        # Fallback: just take uniform samples
        for idx in uniform_indices[:max_frames]:
            if idx < total_frames:
                frame = vr[idx].asnumpy()
                path = os.path.join(output_dir, f"frame_{len(frames):03d}.jpg")
                cv2.imwrite(path, frame)
                frames.append(path)
                if len(frames) >= max_frames:
                    break

    return frames