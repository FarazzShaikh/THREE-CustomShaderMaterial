//=============================================
//Imports from lib/
//=============================================


import {
    GUI
} from './lib/dat.gui.module.js';

//=============================================
//Imports from My Code
//=============================================

//NONE HERE



//=============================================
//Variables Defined in this File
//=============================================




let ui = {

    rotx:0,
    roty:1,
    rotu:0,
    tumble: 0.2,
    fn:1,
    grid:0.5,
    hue:1,
    power:-1,

    baseRad:10.,
    proj:0,
    opacity:0.85,
    
};






//=============================================
//Functions to Export
//=============================================


function createUI() {
    let mainMenu = new GUI();

    mainMenu.width = 300;

    mainMenu.domElement.style.userSelect = 'none';

    mainMenu.add(ui,'power',-5,5,1).name('n: f(z)=z^n');

    let more = mainMenu.addFolder('More');
        more.add(ui,'grid',0,1,0.01).name('grid');
        more.add(ui,'hue',0,1,0.01).name('hue');
        more.add(ui,'opacity',0,1,0.01);
        more.add(ui,'baseRad',0,10,0.1).name('diskRadis');
        more.add(ui,'tumble',0,1,0.01).name('tumble');
        more.add(ui,'rotx',0,1,0.01).name('rotx');
        more.add(ui,'roty',0,1,0.01).name('roty');
        more.add(ui,'rotu',0,1,0.01).name('rotu');

        more.add(ui, 'proj', {
        'Orthographic': 0,
        'Perspective': 1
    }).name('Projection');

    more.close();
}



//=============================================
//Exports from this file
//=============================================


export {
    ui,
    createUI
};
