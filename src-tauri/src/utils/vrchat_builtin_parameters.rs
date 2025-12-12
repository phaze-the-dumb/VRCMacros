use crate::{osc::OSCMessage, structs::parameter_types::ParameterType};

pub fn get_read_addresses() -> Vec<OSCMessage>{
  vec![
    // Avatar Parameters
    OSCMessage {
      address: "/avatar/change".into(),
      values: vec![ ParameterType::String("".into()) ]
    },

    OSCMessage {
      address: "/avatar/parameters/VRCEmote".into(),
      values: vec![ ParameterType::Int(0) ]
    },
    OSCMessage {
      address: "/avatar/parameters/VRCFaceBlendV".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },
    OSCMessage {
      address: "/avatar/parameters/VRCFaceBlendH".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },
    OSCMessage {
      address: "/avatar/parameters/PreviewMode".into(),
      values: vec![ ParameterType::Int(0) ]
    },
    OSCMessage {
      address: "/avatar/parameters/IsAnimatorEnabled".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },

    OSCMessage {
      address: "/avatar/parameters/GestureRightWeight".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },
    OSCMessage {
      address: "/avatar/parameters/GestureLeftWeight".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },
    OSCMessage {
      address: "/avatar/parameters/GestureRight".into(),
      values: vec![ ParameterType::Int(0) ]
    },
    OSCMessage {
      address: "/avatar/parameters/GestureLeft".into(),
      values: vec![ ParameterType::Int(0) ]
    },

    OSCMessage {
      address: "/avatar/parameters/ScaleModified".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/avatar/parameters/ScaleFactor".into(),
      values: vec![ ParameterType::Float(1.0) ]
    },
    OSCMessage {
      address: "/avatar/parameters/ScaleFactorInverse".into(),
      values: vec![ ParameterType::Float(1.0) ]
    },
    OSCMessage {
      address: "/avatar/parameters/EyeHeightAsPercent".into(),
      values: vec![ ParameterType::Float(1.0) ]
    },

    OSCMessage {
      address: "/avatar/parameters/Viseme".into(),
      values: vec![ ParameterType::Int(0) ]
    },
    OSCMessage {
      address: "/avatar/parameters/Voice".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },
    OSCMessage {
      address: "/avatar/parameters/Earmuffs".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/avatar/parameters/MuteSelf".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },

    OSCMessage {
      address: "/avatar/parameters/AFK".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/avatar/parameters/InStation".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/avatar/parameters/Seated".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/avatar/parameters/VRMode".into(),
      values: vec![ ParameterType::Int(0) ]
    },
    OSCMessage {
      address: "/avatar/parameters/TrackingType".into(),
      values: vec![ ParameterType::Int(0) ]
    },

    OSCMessage {
      address: "/avatar/parameters/Grounded".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/avatar/parameters/Upright".into(),
      values: vec![ ParameterType::Float(1.0) ]
    },
    OSCMessage {
      address: "/avatar/parameters/AngularY".into(),
      values: vec![ ParameterType::Float(1.0) ]
    },
    OSCMessage {
      address: "/avatar/parameters/VelocityX".into(),
      values: vec![ ParameterType::Float(1.0) ]
    },
    OSCMessage {
      address: "/avatar/parameters/VelocityY".into(),
      values: vec![ ParameterType::Float(1.0) ]
    },
    OSCMessage {
      address: "/avatar/parameters/VelocityZ".into(),
      values: vec![ ParameterType::Float(1.0) ]
    },
    OSCMessage {
      address: "/avatar/parameters/VelocityMagnitude".into(),
      values: vec![ ParameterType::Float(1.0) ]
    },

    // User Camera
    OSCMessage {
      address: "/usercamera/Mode".into(),
      values: vec![ ParameterType::Int(0) ]
    },
    OSCMessage {
      address: "/usercamera/Pose".into(),
      values: vec![
        ParameterType::Float(0.0),
        ParameterType::Float(0.0),
        ParameterType::Float(0.0),

        ParameterType::Float(0.0),
        ParameterType::Float(0.0),
        ParameterType::Float(0.0)
      ]
    },

    OSCMessage {
      address: "/usercamera/ShowUIInCamera".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/usercamera/LocalPlayer".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/usercamera/RemotePlayer".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/usercamera/Environment".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/usercamera/GreenScreen".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/usercamera/Lock".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/usercamera/SmoothMovement".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/usercamera/LookAtMe".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/usercamera/AutoLevelRoll".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/usercamera/AutoLevelPitch".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/usercamera/Flying".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/usercamera/TriggerTakesPhotos".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/usercamera/DollyPathsStayVisible".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/usercamera/AudioFromCamera".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/usercamera/ShowFocus".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/usercamera/Streaming".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/usercamera/RollWhileFlying".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },
    OSCMessage {
      address: "/usercamera/OrientationIsLandscape".into(),
      values: vec![ ParameterType::Boolean(true) ]
    },

    OSCMessage {
      address: "/usercamera/Zoom".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },
    OSCMessage {
      address: "/usercamera/Exposure".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },
    OSCMessage {
      address: "/usercamera/Aperture".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },
    OSCMessage {
      address: "/usercamera/Hue".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },
    OSCMessage {
      address: "/usercamera/Saturation".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },
    OSCMessage {
      address: "/usercamera/Lightness".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },
    OSCMessage {
      address: "/usercamera/LookAtMeXOffset".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },
    OSCMessage {
      address: "/usercamera/LookAtMeYOffset".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },
    OSCMessage {
      address: "/usercamera/FlySpeed".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },
    OSCMessage {
      address: "/usercamera/TurnSpeed".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },
    OSCMessage {
      address: "/usercamera/SmoothStrength".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },
    OSCMessage {
      address: "/usercamera/PhotoRate".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },
    OSCMessage {
      address: "/usercamera/Duration".into(),
      values: vec![ ParameterType::Float(0.0) ]
    },

    // Trackers
    OSCMessage {
      address: "/tracking/vrsystem/head/pose".into(),
      values: vec![
        ParameterType::Float(0.0),
        ParameterType::Float(0.0),
        ParameterType::Float(0.0),

        ParameterType::Float(0.0),
        ParameterType::Float(0.0),
        ParameterType::Float(0.0),
      ]
    },
    OSCMessage {
      address: "/tracking/vrsystem/rightwrist/pose".into(),
      values: vec![
        ParameterType::Float(0.0),
        ParameterType::Float(0.0),
        ParameterType::Float(0.0),

        ParameterType::Float(0.0),
        ParameterType::Float(0.0),
        ParameterType::Float(0.0),
      ]
    },
    OSCMessage {
      address: "/tracking/vrsystem/leftwrist/pose".into(),
      values: vec![
        ParameterType::Float(0.0),
        ParameterType::Float(0.0),
        ParameterType::Float(0.0),

        ParameterType::Float(0.0),
        ParameterType::Float(0.0),
        ParameterType::Float(0.0),
      ]
    },
  ]
}