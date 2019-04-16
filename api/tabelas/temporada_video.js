//Handle the Video(s) data with the API
var GetAllVideos = () => {
    console.log('GetAllVideos')
}

var GetVideo = (id) => {
    return `GetVideo(id:${id})`
}

var CreateVideo = () => {
    console.log('CreateVideo')
}
var UpdateVideo = () => {
    console.log('UpdateVideo')
}

var DeleteVideo = () => {
    console.log('DeleteVideo')
}

module.exports = {
    GetAllVideos,
    GetVideo,
    CreateVideo,
    UpdateVideo,
    DeleteVideo
}
