import cv2
import os
import numpy as np
from decord import VideoReader
from decord import cpu, gpu

def extract_keyframes(video_path, frames_dir, overwrite=False, start=-1, end=-1, every=1):
   """
   Extract frames from a video using decord's VideoReader
   :param video_path: path of the video file
   :param frames_dir: the directory to save the frames
   :param overwrite: to overwrite frames that already exist?
   :param start: start fram

   """ 