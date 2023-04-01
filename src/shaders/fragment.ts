const fragment_shader_source: string = `

    in vec3 Normal;
    in vec3 FragPos;
    in vec2 vUv;

    uniform vec3 light_pos;
    uniform vec3 mesh_color;
    uniform vec3 view_pos;
    uniform sampler2D perlin;
    uniform float time;

    void main() {
        // ambient light color (white)
        vec3 light_color = vec3(1.0, 1.0, 1.0);

        // calculate ambient light
        float ambientStrength = 0.8;
        vec3 ambient = ambientStrength * light_color; 

        // calculate diffuse light
        vec3 norm = normalize(Normal);
        vec3 lightDir = normalize(light_pos - FragPos);

        float diff = max(dot(norm, lightDir), 0.0);
        vec3 diffuse = light_color * diff;

        // specular
        vec3 viewDir = normalize(view_pos - FragPos);
        vec3 reflectDir = reflect(-1.0 * lightDir, norm);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0001), 32.0);
        vec3 specular = 0.5 * spec * light_color;  

        // final color based on lighting
        vec3 object_color = 0.1 * sin(5.0 * time) * mesh_color + 0.8;
        object_color *= texture2D(perlin, vUv * sin(time)).rgb * 0.7;
        vec3 result = (ambient + diffuse + specular) * object_color;

        gl_FragColor = vec4(result, 1.0);
    }

`;

export default fragment_shader_source;