
const{ipcRenderer} = require('electron')
const{$}=require('./helper')
const path=require('path')
let musicFilesPath=[]
$('select-music').addEventListener('click',()=>{
    ipcRenderer.send('open-music-file')
})

const renderListHTML=(pathes)=>{
    const musicList=$('musicList')
    const musicItemsHTML=pathes.reduce((html,music)=>{
        html+='<li class="list-group-item">'+path.basename(music)+'</li>'
        return html
    },'')
    musicList.innerHTML='<ul class="list-group">'+musicItemsHTML+'</ul>'
}

ipcRenderer.on('selected-file',(event,path)=>{
    // alert("stupid is here")

    if(Array.isArray(path)){
        renderListHTML(path)
        musicFilesPath=path
    }
})

// $('add-music').addEventListener('click',()=>{
//     // ipcRenderer.send('add-tracks',musicFilesPat
//     alert("test")
// })
// 因为添加上面代码导致的错误

$('add-music-btn').addEventListener('click',()=>{
    // alert("ajgdkj")
    ipcRenderer.send('add-tracks',musicFilesPath)
})