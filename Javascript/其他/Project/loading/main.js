const element = (id) => document.getElementById(id);

const effect = element("animation");

for(i=0;i<5;i++){
    const div = document.createElement('div');
    const square = effect.appendChild(div);
    square.setAttribute('class',`box box${i}`);
}