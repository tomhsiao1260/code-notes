attribute vec2 a_position;
attribute vec2 a_texCoord;
uniform vec2 u_resolution;
uniform mat3 u_matrix;
varying vec2 v_texCoord;
 
void main() {
	// convert the position from pixels to 0.0 to 1.0
    vec2 normalized = a_position / u_resolution;
    // convert from 0->1 to -1->+1 (clip space)
	vec2 clipSpace = 2.0 * normalized - 1.0;

	// reverse y axis
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    // or just transform by matrix
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);

    v_texCoord = a_texCoord;
 }