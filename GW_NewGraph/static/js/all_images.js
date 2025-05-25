preload_images = []
for (i=0;i< imageList.length;i++){
    preload_images.push('../static/images/' + imageList[i])
}
preload_images.push('../static/images/isi.png','../static/images/shortest_img_1.png','../static/images/shortest_img_2.png',
    '../static/images/isigreen.png','../static/images/isiblue.png','../static/images/GW-Tutorial/canoe.jpg', '../static/images/GW-Tutorial/chainsaw.jpg',
    '../static/images/GW-Tutorial/golfcart.jpg', '../static/images/GW-Tutorial/trophy.jpg', '../static/images/GW-Tutorial/chess.jpg', '../static/images/GW-Tutorial/marble.jpg',
    '../static/images/GW-Tutorial/pan.jpg', '../static/images/GW-Tutorial/heater.jpg')


var all_images = preload_images