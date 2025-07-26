preload_images = []
for (i=0;i< imageList.length;i++){
    preload_images.push('../static/images/' + imageList[i])
    
}
for (i=1; i<=6;i++){
    preload_images.push(`../static/images/short${i}.png`)
}
preload_images.push('../static/images/isi.png','../static/images/shortest_img_1.png','../static/images/shortest_img_2.png',
    '../static/images/isigreen.png','../static/images/isiblue.png','../static/images/GW-Tutorial/canoe.jpg', '../static/images/GW-Tutorial/chainsaw.jpg',
    '../static/images/GW-Tutorial/golfcart.jpg', '../static/images/GW-Tutorial/trophy.jpg', '../static/images/GW-Tutorial/chess.jpg', '../static/images/GW-Tutorial/marble.jpg',
    '../static/images/GW-Tutorial/pan.jpg', '../static/images/GW-Tutorial/heater.jpg','../static/images/GW-Tutorial/object_029.jpg', '../static/images/GW-Tutorial/object_068.jpg', '../static/images/GW-Tutorial/object_102.jpg', '../static/images/GW-Tutorial/object_175.jpg', '../static/images/GW-Tutorial/object_229.jpg', '../static/images/GW-Tutorial/object_250.jpg', '../static/images/GW-Tutorial/object_268.jpg', '../static/images/GW-Tutorial/object_334.jpg','../static/images/story_example_01.png','../static/images/story_example_02.png','../static/images/story_example_03.png','../static/images/story_example_04.png','../static/images/story_example_05.png')
var all_images = preload_images