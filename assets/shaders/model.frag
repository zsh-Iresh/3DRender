#version 460 core
out vec4 FragColor;

struct PointLight  {
    vec3 color;
    vec3 position;  

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    float constant;
    float linear; 
    float quadratic;
};


in vec3 model_position;
in vec3 model_normal;
in vec2 model_texcoord;

uniform sampler2D texture_diffuse1;
uniform sampler2D texture_specular1;
uniform vec3 view_position; 
uniform PointLight point_light; 


void main()
{
    vec3 norm = normalize(model_normal);//model normal

    //ambient
    vec3 ambient = point_light.color * point_light.ambient * vec3(texture(texture_diffuse1, model_texcoord));

	//diffuse
    vec3 lightDir = normalize(point_light.position - model_position);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = point_light.color * point_light.diffuse * diff * vec3(texture(texture_diffuse1, model_texcoord));

    //specular
    vec3 viewDir = normalize(view_position - model_position);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32);
    vec3 specular = point_light.color * point_light.specular * spec * vec3(texture(texture_specular1, model_texcoord));

    //  attenuation
    float distance = length(point_light.position - model_position);
    float attenuation = 1.0 / (point_light.constant + point_light.linear * distance +point_light.quadratic * distance * distance);

    ambient  *= attenuation; 
    diffuse  *= attenuation;
    specular *= attenuation;

	vec4 result = vec4(ambient + diffuse + specular ,1.0f);
    FragColor = result;
}