const vertex_shader_source: string = `
    out vec3 Normal;
    out vec3 FragPos;
    out vec2 vUv;

    uniform sampler2D perlin;
    uniform float time;
    uniform vec3 translate;

    mat4 rotationMatrix(vec3 axis, float angle)
    {
        axis = normalize(axis);
        float s = sin(angle);
        float c = cos(angle);
        float oc = 1.0 - c;
        
        return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                    0.0,                                0.0,                                0.0,                                1.0);
    }

    void main() {

        vec3 normal = normalMatrix * position;
        vec4 norm_4 = vec4(normal, 1.0);


        vec4 noise = texture2D(perlin, uv);
        float pulse_dir = dot(norm_4, noise);
        float pulse_strength = 0.15; // default: 0.15
        float pulse_z = dot(texture2D(perlin, uv), norm_4.zzzw);

        // local space
        vec3 pulse_pos = position;
        vec3 pulse_wave = sin(3.0 * time) * vec3(1.0);
        pulse_pos += pulse_strength * pulse_dir * pulse_wave * texture2D(perlin, uv).xyz;

        pulse_pos.z += pulse_strength * -max(float(0.25 * sin(2.5 * time) * pulse_z), 0.1);

        // fix lighting from rotating sphere
        // world space
        vec4 model_pos = modelMatrix * vec4(pulse_pos, 1.0);
        // model_pos.x += 

        // view space
        vec4 view_pos = viewMatrix * model_pos;

        // clip space
        vec4 proj_pos = projectionMatrix * view_pos;

        gl_Position = proj_pos; 
        Normal = normalMatrix * pulse_pos.xyz;
        FragPos = model_pos.xyz; 
    }
`;

export default vertex_shader_source;