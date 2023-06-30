// WebGL setup and animation loop for multiple canvases
const canvasContainerElements = document.querySelectorAll("canvasContainer");
console.log(canvasContainerElements);
canvasContainerElements.forEach((canvasContainer) => {
    const canvas = canvasContainer.querySelector("canvas");
 const gl = canvas.getContext("webgl");



// Get the mouse position on the canvas
canvasContainer.addEventListener('mousemove', handleMouseMove);

let mousePosition = { x: 0, y: 0 };

function handleMouseMove(event) {
  // Normalize mouse coordinates
  const rect = canvas.getBoundingClientRect();
  mousePosition.x = (event.clientX - rect.left) / rect.width;
  mousePosition.y = (event.clientY - rect.top) / rect.height;
}

 // Vertex shader code
 const vertexShaderSource = `
   attribute vec2 position;
   
   void main() {
     gl_Position = vec4(position, 0.0, 1.0);
   }
 `;

 // Fragment shader code (pixel shader)
 const fragmentShaderSource = `
   precision mediump float;

   uniform float time;
   uniform vec2 resolution;

   uniform vec2 mouse;


   #define SCALE 2.
   
   vec3 random_perlin(vec3 p) {
       p = vec3(
           dot(p, vec3(127.1, 311.7, 69.5)),
           dot(p, vec3(269.5, 183.3, 132.7)),
           dot(p, vec3(247.3, 108.5, 96.5))
       );
       return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
   }
   
   float noise_perlin(vec3 p) {
       vec3 i = floor(p);
       vec3 s = fract(p);
   
       // 3D grid has 8 vertices
       float a = dot(random_perlin(i), s);
       float b = dot(random_perlin(i + vec3(1.0, 0.0, 0.0)), s - vec3(1.0, 0.0, 0.0));
       float c = dot(random_perlin(i + vec3(0.0, 1.0, 0.0)), s - vec3(0.0, 1.0, 0.0));
       float d = dot(random_perlin(i + vec3(0.0, 0.0, 1.0)), s - vec3(0.0, 0.0, 1.0));
       float e = dot(random_perlin(i + vec3(1.0, 1.0, 0.0)), s - vec3(1.0, 1.0, 0.0));
       float f = dot(random_perlin(i + vec3(1.0, 0.0, 1.0)), s - vec3(1.0, 0.0, 1.0));
       float g = dot(random_perlin(i + vec3(0.0, 1.0, 1.0)), s - vec3(0.0, 1.0, 1.0));
       float h = dot(random_perlin(i + vec3(1.0, 1.0, 1.0)), s - vec3(1.0, 1.0, 1.0));
   
       // Smooth Interpolation
       vec3 u = smoothstep(0.0, 1.0, s);
   
       // Interpolate based on the eight vertices
       return mix(
           mix(mix(a, b, u.x), mix(c, e, u.x), u.y),
           mix(mix(d, f, u.x), mix(g, h, u.x), u.y),
           u.z
       );
   }
   
   void main() {
       vec2 uv = gl_FragCoord.xy / resolution.xy;
       float distance = distance(vec2(0.5,0.5), mouse)*0.05;
       float c = noise_perlin(vec3(SCALE * uv, time * 0.05)) +0.4;
   

       // Define the heatmap colors
       vec3 color1 = vec3(0.117647, 0.196078, 0.301961);  // #1e324d
       vec3 color2 = vec3(0.607843, 0.588235, 0.909804);  // #9b96e8
       vec3 color3 = vec3(0.462745, 0.627451, 0.721569);  // #76a0b8
       vec3 color4 = vec3(0.384314, 0.380392, 0.372549);  // #62615f
   
       // Perform color interpolation based on the heatmap value
       vec3 color;
       if (c < 0.25)
           color = mix(color1, color2, c * 4.0);
       else if (c < 0.5)
           color = mix(color2, color3, (c - 0.25) * 4.0);
       else if (c < 0.75)
           color = mix(color3, color4, (c - 0.5) * 4.0);
       else
           color = color4;
   
       gl_FragColor = vec4(color*0.9, 1.0);
   }
   
   
 `;

 // Create and compile vertex shader
 const vertexShader = gl.createShader(gl.VERTEX_SHADER);
 gl.shaderSource(vertexShader, vertexShaderSource);
 gl.compileShader(vertexShader);

 // Create and compile fragment shader
 const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
 gl.shaderSource(fragmentShader, fragmentShaderSource);
 gl.compileShader(fragmentShader);

 // Create a shader program and attach the shaders
 const shaderProgram = gl.createProgram();
 gl.attachShader(shaderProgram, vertexShader);
 gl.attachShader(shaderProgram, fragmentShader);
 gl.linkProgram(shaderProgram);
 gl.useProgram(shaderProgram);

 // Create the vertex buffer
 const positionBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
 const vertices = [
   -1.0, -1.0,
   1.0, -1.0,
   -1.0, 1.0,
   -1.0, 1.0,
   1.0, -1.0,
   1.0, 1.0
 ];
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
 const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "position");
 gl.enableVertexAttribArray(positionAttributeLocation);
 gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

 // Set the resolution uniform
 const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "resolution");
 gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

 let startTime = Math.random()*100000000;
 
 // Animation loop
 function render(timestamp) {
     if (!startTime) startTime = timestamp;
     const time = (timestamp - startTime) / 1000; // Convert to seconds
     
   // Set the time uniform
   const timeUniformLocation = gl.getUniformLocation(shaderProgram, "time");
   gl.uniform1f(timeUniformLocation, time);


   const mouseUniformLocation = gl.getUniformLocation(shaderProgram, "mouse");
   gl.uniform2f(mouseUniformLocation, mousePosition.x, -mousePosition.y);

   // Render the scene
   gl.drawArrays(gl.TRIANGLES, 0, 6);

   // Request the next frame
   requestAnimationFrame(render);
 }

 // Start the animation loop
 requestAnimationFrame(render);

});