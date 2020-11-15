import {drawKeyPoints, drawSkeleton} from './utils'
import React, {Component} from 'react'
import * as posenet from '@tensorflow-models/posenet'
import { NonMaxSuppressionV5 } from '@tensorflow/tfjs-core'

class PoseNet extends Component {
  static defaultProps = {
    videoWidth: 900,
    videoHeight: 700,
    showSkeleton: true,
    showPoints: true,
    minPoseConfidence: 0.1,
    minPartConfidence: 0.5,
    maxPoseDetections: 2,
    nmsRadius: 20,
    outputStride: 16,
    imageScaleFactor: 0.5,
    skeletonColor: '#ffadea',
    skeletonLineWidth: 6,
    loadingText: 'Loading... Posenet Model..'
  }

  constructor(props) {
    super(props, PoseNet.defaultProps)
    this.state = {
      userRepCount:0,
      partnerRepCount:0,
    }
  }

  getCanvas = elem => {
    this.canvas = elem
  }

  getVideo = elem => {
    this.video = elem
  }

  async componentDidMount() {
    try {
      await this.setupCamera()
    } catch (error) {
      throw new Error(
        'This browser does not support video capture, or this device does not have a camera'
      )
    }

    try {
      this.posenet = await posenet.load()
    } catch (error) {
      throw new Error('PoseNet failed to load')
    } finally {
      setTimeout(() => {
        this.setState({loading: false})
      }, 200)
    }
    this.detectPose()
  }

  async setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available'
      )
    }
    const {videoWidth, videoHeight} = this.props
    const video = this.video
    video.width = videoWidth
    video.height = videoHeight

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width: videoWidth,
        height: videoHeight
      }
    })

    video.srcObject = stream

    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        video.play()
        resolve(video)
      }
    })
  }

  detectPose() {
    const {videoWidth, videoHeight} = this.props
    const canvas = this.canvas
    const canvasContext = canvas.getContext('2d')
    
    canvas.width = videoWidth
    canvas.height = videoHeight

    this.poseDetectionFrame(canvasContext)
  }

  poseDetectionFrame(canvasContext) {
    const {
      imageScaleFactor, 
      outputStride, 
      minPoseConfidence, 
      minPartConfidence, 
      videoWidth, 
      videoHeight, 
      showPoints, 
      showSkeleton, 
      skeletonColor, 
      skeletonLineWidth 
      } = this.props

    const posenetModel = this.posenet
    const video = this.video

    const findPoseDetectionFrame = async () => {
      const pose = await posenetModel.estimateSinglePose(video, {
        flipHorizontal: true
      })
      fetch('/getReps',{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
          'userid':this.props.yourID,
          'receiverid':this.props.receiverID,
          'probabilities':pose})
    }).then(response => response.json).then(data =>{
        this.setState({
          userRepCount: data['userRepCount'],
          partnerRepCount: data['partnerRepCount']
        })
      })
      canvasContext.clearRect(0, 0, videoWidth, videoHeight)
      
      const {keypoints, score} = pose;
      if (score >= minPoseConfidence) {
        if (showPoints) {
          drawKeyPoints(
            keypoints,
            minPartConfidence,
            skeletonColor,
            canvasContext
          )
        }
        if (showSkeleton) {
          drawSkeleton(
            keypoints,
            minPartConfidence,
            skeletonColor,
            skeletonLineWidth,
            canvasContext
          )
        }
      }
      requestAnimationFrame(findPoseDetectionFrame)
    }
    findPoseDetectionFrame()
  }

  render() {
    const canvasStyle = {
      position:'absolute',
      top:0,
      left:0
    }

    const videoStyle = {
      display:'none',
    }
    return (
      <>
      <video style = {videoStyle} id="videoNoShow" playsInline ref={this.getVideo}/>
      <canvas style = {canvasStyle} className="webcam" ref={this.getCanvas} />
      <h1 class = 'rep-count'>{this.state.userRepCount}</h1>
      <h1 class = 'rep-count'>{this.state.partnerRepCount}</h1>
      </>
    )
  }
}

export default PoseNet