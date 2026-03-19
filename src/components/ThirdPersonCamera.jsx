import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

var DISTANCE = 10;
var MIN_PITCH = 0.15;
var MAX_PITCH = 1.2;
var SENSITIVITY = 0.005;

function ThirdPersonCamera(props) {
  var target = props.target;
  var mouseRef = useRef({ yaw: 0, pitch: 0.4 });
  var draggingRef = useRef(false);

  useEffect(function () {
    function onMouseDown(e) {
      // Right-click or middle-click to drag camera
      if (e.button === 2 || e.button === 1) {
        draggingRef.current = true;
      }
    }

    function onMouseUp(e) {
      if (e.button === 2 || e.button === 1) {
        draggingRef.current = false;
      }
    }

    function onMouseMove(e) {
      if (draggingRef.current) {
        var m = mouseRef.current;
        m.yaw -= e.movementX * SENSITIVITY;
        m.pitch = Math.max(MIN_PITCH, Math.min(MAX_PITCH, m.pitch - e.movementY * SENSITIVITY));
      }
    }

    function onContextMenu(e) {
      // Prevent right-click menu on canvas
      if (e.target && e.target.tagName === "CANVAS") {
        e.preventDefault();
      }
    }

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("contextmenu", onContextMenu);

    return function () {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("contextmenu", onContextMenu);
    };
  }, []);

  useFrame(function (state) {
    if (!target.current) return;

    var playerPos = target.current.position;
    var m = mouseRef.current;

    // Spherical coordinates around player
    var camX = playerPos.x + Math.sin(m.yaw) * Math.cos(m.pitch) * DISTANCE;
    var camY = Math.sin(m.pitch) * DISTANCE + 2;
    var camZ = playerPos.z + Math.cos(m.yaw) * Math.cos(m.pitch) * DISTANCE;

    // Smooth follow
    var targetPos = new THREE.Vector3(camX, camY, camZ);
    state.camera.position.lerp(targetPos, 0.08);

    // Look at player head height
    var lookTarget = new THREE.Vector3(playerPos.x, 1.5, playerPos.z);
    state.camera.lookAt(lookTarget);
  });

  return null;
}

export default ThirdPersonCamera;
