var labelList = [];
var picList = [];
var svg = null
var flag = false;
var currentPic = null;
var currentLabel = null;
var resizingSide = false;
var resizedSide = null;
var resizingCorner = false;
var resizedCorner = null;
var moving = false;
var movingCoords = null;
var boxSize = 15

class Pic {
    constructor(name, source, topBar) {
        this.name = name;
        this.source = source;
        this.labelList = [];
        var obj = this;
        this.pic = topBar.append('div')
            .attr('class', 'pic-div passive-pic')
            .attr('width', '120px')
            .on('click', function(){
                if (PicValidation()){
                    currentPic = obj;
                    d3.selectAll('.pic-div')
                        .classed('active-pic', false)
                        .classed('passive-pic', true);
                    d3.select(this)
                        .classed('passive-pic', false)
                        .classed('active-pic', true);
                    SelectImage();
                }
            })

        var img = new Image();
        img.src = source;

        var a = this.pic
        img.addEventListener('load', function() {   
            a.append('img')
            .attr('src', source)
            .attr('class', 'pic');

            a.append('label')
                .text(name)
                .attr('class', 'pic-text');
        });
    }
}

class Label {
    constructor(label, image, li) {
        this.image = image;
        this.li = li;
        this.lines = null;
        this.label = label;
        this.resize = null;
        this.move = null;
      }
}

var list = d3.select('#list');
var deleteButton = d3.select('#delete');
var topBar = d3.select('.pic-container');

GetData();
currentPic = picList[0];
currentPic.pic.attr('class', 'pic-div active-pic')
SelectImage();

function GetData(){
    picList.push(new Pic("amogus", "https://www.amogus.org/amogus.png", topBar));
    picList.push(new Pic("amogus2", "https://i.pinimg.com/originals/36/52/e7/3652e7bae997f73f9139265ac92dc0aa.png", topBar));
    picList.push(new Pic("amogus", "https://www.amogus.org/amogus.png", topBar));
    picList.push(new Pic("amogus2", "https://i.pinimg.com/originals/36/52/e7/3652e7bae997f73f9139265ac92dc0aa.png", topBar));
    picList.push(new Pic("amogus", "https://www.amogus.org/amogus.png", topBar));
    picList.push(new Pic("amogus2", "https://i.pinimg.com/originals/36/52/e7/3652e7bae997f73f9139265ac92dc0aa.png", topBar));
    picList.push(new Pic("amogus", "https://www.amogus.org/amogus.png", topBar));
    picList.push(new Pic("amogus2", "https://i.pinimg.com/originals/36/52/e7/3652e7bae997f73f9139265ac92dc0aa.png", topBar));
}

function SelectImage(){
    $('#svg').empty();

    var img = new Image();
    img.src = currentPic.source;

    img.addEventListener('load', function() {   
        svg = d3.select('#svg')
            .attr('viewBox', "0 0 " + img.width + " " + img.height)
            .attr('preserveAspectRatio', 'none');

        svg.append("image")
            .attr('href', currentPic.source)
            .attr('height', '100%')
            .attr('width', '100%')
            .attr('id', "image");

        svg.on("mousedown", function() {
        if (currentLabel == null){
            return;
        }
        if (!flag && currentLabel?.lines == null){
            flag = true;
            var coords = d3.mouse(this);
            currentLabel.lines = CreateRectangle(coords[0], coords[1]);
        }
        });

        svg.on("mousemove", function() {
        if(flag) {
            var coords = d3.mouse(this);
            currentLabel.lines.filter(function (d, i) { return i === 0;})
                .attr('x2', coords[0]);
                currentLabel.lines.filter(function (d, i) { return i === 1;})
                .attr('y2', coords[1]);
            currentLabel.lines.filter(function (d, i) { return i === 2;})
                .attr('x1', coords[0])
                .attr('x2', coords[0])
                .attr('y2', coords[1]);
            currentLabel.lines.filter(function (d, i) { return i === 3;})
                .attr('y1', coords[1])
                .attr('y2', coords[1])
                .attr('x2', coords[0]);
        }
        else if(resizingSide){
            var coords = d3.mouse(this);
            currentLabel.resize.remove();
            currentLabel.move.remove();
            switch (resizedSide){
                case 0:
                case 2:
                    var y = currentLabel.lines[0][resizedSide].getAttribute("y1")
                    currentLabel.lines.filter(function (d, i) { return i === resizedSide;})
                        .attr('y1', coords[1])
                        .attr('y2', coords[1])
                    if(currentLabel.lines[0][1].getAttribute("y1") === y){
                        var attr = "y1";
                    }
                    else{
                        var attr = "y2";
                    }
                    currentLabel.lines.filter(function (d, i) { return i === 1 || i === 3;})
                        .attr(attr, coords[1])
                        .attr(attr, coords[1]);
                    break;
                case 1:
                case 3:
                    var x = currentLabel.lines[0][resizedSide].getAttribute("x1")
                    currentLabel.lines.filter(function (d, i) { return i === resizedSide;})
                        .attr('x1', coords[0])
                        .attr('x2', coords[0])
                    if(currentLabel.lines[0][0].getAttribute("x1") === x){
                        var attr = "x1";
                    }
                    else{
                        var attr = "x2";
                    }
                    currentLabel.lines.filter(function (d, i) { return i === 0 || i === 2;})
                        .attr(attr, coords[0])
                        .attr(attr, coords[0]);
                    break;
            }    
        }
        else if(resizingCorner){
            var coords = d3.mouse(this);
            currentLabel.resize.remove();
            currentLabel.move.remove();
            switch(resizedCorner){
                case '01':
                    var y = currentLabel.lines[0][0].getAttribute("y1")
                    var x = currentLabel.lines[0][1].getAttribute("x1")
                    if(currentLabel.lines[0][1].getAttribute("y1") === y){
                        var attry = "y1";
                    }
                    else{
                        var attry = "y2";
                    }
                    if(currentLabel.lines[0][0].getAttribute("x1") === x){
                        var attrx = "x1";
                    }
                    else{
                        var attrx = "x2";
                    }
                    currentLabel.lines.filter(function (d, i) { return i === 0;})
                        .attr(attrx, coords[0])
                        .attr('y1', coords[1])
                        .attr('y2', coords[1]);
                    currentLabel.lines.filter(function (d, i) { return i === 1;})
                        .attr('x1', coords[0])
                        .attr('x2', coords[0])
                        .attr(attry, coords[1]);
                    currentLabel.lines.filter(function (d, i) { return i === 2;})
                        .attr(attrx, coords[0])
                    currentLabel.lines.filter(function (d, i) { return i === 3;})
                        .attr(attry, coords[1]);
                    break;
                case '03':
                    var y = currentLabel.lines[0][0].getAttribute("y1")
                    var x = currentLabel.lines[0][3].getAttribute("x1")
                    if(currentLabel.lines[0][3].getAttribute("y1") === y){
                        var attry = "y1";
                    }
                    else{
                        var attry = "y2";
                    }
                    if(currentLabel.lines[0][0].getAttribute("x1") === x){
                        var attrx = "x1";
                    }
                    else{
                        var attrx = "x2";
                    }
                    currentLabel.lines.filter(function (d, i) { return i === 0;})
                        .attr(attrx, coords[0])
                        .attr('y1', coords[1])
                        .attr('y2', coords[1]);
                    currentLabel.lines.filter(function (d, i) { return i === 1;})
                        .attr(attry, coords[1]);
                    currentLabel.lines.filter(function (d, i) { return i === 2;})
                        .attr(attrx, coords[0])
                    currentLabel.lines.filter(function (d, i) { return i === 3;})
                        .attr('x1', coords[0])
                        .attr('x2', coords[0])
                        .attr(attry, coords[1]);
                    break;
                case '21':
                    var y = currentLabel.lines[0][2].getAttribute("y1")
                    var x = currentLabel.lines[0][1].getAttribute("x1")
                    if(currentLabel.lines[0][1].getAttribute("y1") === y){
                        var attry = "y1";
                    }
                    else{
                        var attry = "y2";
                    }
                    if(currentLabel.lines[0][2].getAttribute("x1") === x){
                        var attrx = "x1";
                    }
                    else{
                        var attrx = "x2";
                    }
                    currentLabel.lines.filter(function (d, i) { return i === 0;})
                        .attr(attrx, coords[0]);
                    currentLabel.lines.filter(function (d, i) { return i === 1;})
                        .attr('x1', coords[0])
                        .attr('x2', coords[0])
                        .attr(attry, coords[1]);
                    currentLabel.lines.filter(function (d, i) { return i === 2;})
                        .attr(attrx, coords[0])
                        .attr('y1', coords[1])
                        .attr('y2', coords[1]);
                    currentLabel.lines.filter(function (d, i) { return i === 3;})
                        .attr(attry, coords[1]);
                    break;
                case '23':
                    var y = currentLabel.lines[0][2].getAttribute("y1")
                    var x = currentLabel.lines[0][3].getAttribute("x1")
                    if(currentLabel.lines[0][3].getAttribute("y1") === y){
                        var attry = "y1";
                    }
                    else{
                        var attry = "y2";
                    }
                    if(currentLabel.lines[0][2].getAttribute("x1") === x){
                        var attrx = "x1";
                    }
                    else{
                        var attrx = "x2";
                    }
                    currentLabel.lines.filter(function (d, i) { return i === 0;})
                        .attr(attrx, coords[0]);
                    currentLabel.lines.filter(function (d, i) { return i === 1;})
                        .attr(attry, coords[1]);
                    currentLabel.lines.filter(function (d, i) { return i === 2;})
                        .attr(attrx, coords[0])
                        .attr('y1', coords[1])
                        .attr('y2', coords[1]);
                    currentLabel.lines.filter(function (d, i) { return i === 3;})
                        .attr('x1', coords[0])
                        .attr('x2', coords[0])
                        .attr(attry, coords[1]);
                    break;
            }
        }
        else if(moving){
            currentLabel.resize.remove();
            currentLabel.move.remove();
            var coords = d3.mouse(this);
            var xmove = coords[0] - movingCoords[0];
            var ymove = coords[1] - movingCoords[1];
            
            for(var i = 0; i < 4; i++){
                currentLabel.lines[0][i].x1.baseVal.value += xmove;
                currentLabel.lines[0][i].x2.baseVal.value += xmove;
                currentLabel.lines[0][i].y1.baseVal.value += ymove;
                currentLabel.lines[0][i].y2.baseVal.value += ymove;
            }
            //currentLabel.lines
            //    .attr("transform", "translate(" + xmove + "," + ymove + ")");
            movingCoords = coords;
        }
        });

        d3.select('body').on("mouseup", function() {
        if(flag || resizingCorner || resizingSide || moving) {
            flag = false; 
            resizingCorner = false;
            resizedCorner = null;
            resizingSide = false;
            resizedSide = null;   
            moving = false;
            movingCoords = null;
            currentLabel.resize = CreateResize(currentLabel.lines);
            currentLabel.move = CreateMove(currentLabel.lines);
        }
        });

        //svg.on("mouseleave", function() {
        //    if(flag == true) {
        //        rect.remove();
        //        flag = false;
        //        rect = null;
        //    }
        //});
        $('#list').empty();
        LoadPic();
    });
}

function LoadPic(){
    if(currentPic.labelList.length != 0){
        currentPic.labelList.forEach((label) => {
            label.lines[0].forEach((line) => {
                $('#svg').append(line);
            });
            label.resize[0].forEach((resize) => {
                $('#svg').append(resize);
            });
            $('#svg').append(label.move[0]);
            $('#list').append(label.li[0]);
        });

        d3.selectAll('li')
            .attr('class', 'passive-label');

        d3.selectAll('line')
            .attr('class', 'passive-line');

        d3.selectAll('.active-move')
            .attr('class', 'passive-move');

        d3.selectAll('.box')
            .classed('active-box', false)
            .classed('passive-box', true);

        currentLabel = currentPic.labelList[currentPic.labelList.length - 1];

        currentLabel.lines.attr('class', 'active-line');
        currentLabel.li.attr('class', 'active-label');
        currentLabel.move.attr('class', 'active-move');
        currentLabel.resize.classed('passive-box', false)
            .classed('active-box', false);
    }
}

function AppendList(){
    if(currentLabel != null && CheckLabelRectangles(currentPic.labelList)){
        alert("Please draw a rectangle for selected label.")
    }
    else{
        var li = list.append('li')
        .attr('contentEditable', 'true')
        .text('label')
        .attr('class', "active-label");

        var label = new Label("label", currentPic, li);
        
        currentLabel?.li.attr("class", "passive-label");
        currentLabel?.lines?.attr("class", "passive-line");
        currentLabel?.resize?.classed("active-box", false)
            .classed("passive-box", true);
        currentLabel?.move?.attr("class", "passive-move");
        currentLabel = label;
        currentPic.labelList.push(label);


        rect = null;

        li.on("click", function(){
            currentLabel?.lines?.attr("class", "passive-line");
            currentLabel?.li?.attr("class", "passive-label");
            currentLabel?.resize?.classed("active-box", false)
                .classed("passive-box", true);
            currentLabel?.move?.attr("class", "passive-move");
            currentLabel = label;
            li.attr("class", "active-label");
            currentLabel.lines?.attr("class", "active-line");
            currentLabel?.resize?.classed("passive-box", false)
                .classed("active-box", true);
            currentLabel?.move?.attr("class", "active-move");
            deleteButton.style('display', 'block');
        });
    }
}

function DeleteLabel(){
    currentPic.labelList = currentPic.labelList.filter(label => label != currentLabel);
    currentLabel.li?.remove();
    currentLabel.lines?.remove();
    currentLabel.resize?.remove();
    currentLabel.move?.remove();
    currentLabel = null;
    deleteButton.style('display', 'none');
}

function DeepCopy(object){
    return JSON.parse(JSON.stringify(object))
}

function CreateRectangle(x, y){
    for(var i = 0; i < 4; i++){
        svg.append('line')
        .attr('x1', x)
        .attr('x2', x)
        .attr('y1', y)
        .attr('y2', y)
        .attr('class', 'active-line');
    }
    return d3.selectAll(".active-line");
}

function CheckLabelRectangles(labelList){
    for(var i = 0; i < labelList.length; i++){
        if(labelList[i].lines == null){
            currentLabel.li?.attr("class", "passive-label");
            currentLabel.lines?.attr("class", "passive-line");
            currentLabel?.resize?.classed("active-box", false)
                .classed("passive-box", true);
            currentLabel?.move?.attr("class", "passive-move");
            currentLabel = labelList[i];
            currentLabel.li.attr("class", "active-label");
            return true;
        }
    }
    return false;
}

function CreateResize(rectangle){
    SortLines(rectangle);

    CreateCorner(0, 3, rectangle, boxSize, "box nwr active-box");
    CreateCorner(0, 1, rectangle, boxSize, "box ner active-box");
    CreateCorner(2, 3, rectangle, boxSize, "box ner active-box");
    CreateCorner(2, 1, rectangle, boxSize, "box nwr active-box");
    CreateSide(0, rectangle, boxSize, "box nr active-box");
    CreateSide(1, rectangle, boxSize, "box er active-box");
    CreateSide(2, rectangle, boxSize, "box nr active-box");
    CreateSide(3, rectangle, boxSize, "box er active-box");

    return d3.selectAll(".active-box");
}

function CreateCorner(side1, side2, rectangle, boxSize, label){
    return svg.append('rect')
    .attr('x', function(){
        if(rectangle[0][side1].getAttribute("x1") === rectangle[0][side2].getAttribute("x1")){
            return parseFloat(rectangle[0][side1].getAttribute("x1")) - boxSize / 2;
        }
        else{
            return parseFloat(rectangle[0][side1].getAttribute("x2")) - boxSize / 2;
        }
    })
    .attr('y', function(){
        if(rectangle[0][side1].getAttribute("y1") === rectangle[0][side2].getAttribute("y1")){
            return parseFloat(rectangle[0][side1].getAttribute("y1")) - boxSize / 2;
        }
        else{
            return parseFloat(rectangle[0][side1].getAttribute("y2")) - boxSize / 2;
        }
    })
    .attr('width', boxSize)
    .attr('height', boxSize)
    .attr('class', label)
    .on('mousedown', function(){ 
        resizingCorner = true;
        resizedCorner = side1.toString().concat(side2.toString());
    });
}

function CreateSide(side, rectangle, boxSize, label){
    return svg.append('rect')
    .attr('x', function(){
        if(side % 2 === 0){
            var x1 = parseFloat(rectangle[0][side].getAttribute("x1"));
            var x2 = parseFloat(rectangle[0][side].getAttribute("x2"));
            return (x1 + x2) / 2 - boxSize / 2;
        }
        else{
            return parseFloat(rectangle[0][side].getAttribute("x1")) - boxSize / 2;
        }
    })
    .attr('y', function(){
        if(side % 2 === 1){
            var y1 = parseFloat(rectangle[0][side].getAttribute("y1"));
            var y2 = parseFloat(rectangle[0][side].getAttribute("y2"));
            return (y1 + y2) / 2 - boxSize / 2;
        }
        else{
            return parseFloat(rectangle[0][side].getAttribute("y1")) - boxSize / 2;
        }  
    })
    .attr('width', boxSize)
    .attr('height', boxSize)
    .attr('class', label)
    .on('mousedown', function(){ 
        resizingSide = true;
        resizedSide = side;
    });
}

function SortLines(rectangle){ //top, right, bot, left
    var topOrBot = rectangle.filter(function(d, i) {
        return rectangle[0][i].getAttribute("y1")==rectangle[0][i].getAttribute("y2")});

    if (parseInt(topOrBot[0][0].getAttribute("y1")) > parseInt(topOrBot[0][1].getAttribute("y1"))){
        var bot = topOrBot[0][0];
        var top = topOrBot[0][1];
    }
    else{
        var bot = topOrBot[0][1];
        var top = topOrBot[0][0];
    }

    var leftOrRight = rectangle.filter(function(d, i) {
        return rectangle[0][i].getAttribute("x1")==rectangle[0][i].getAttribute("x2")});

        if (parseInt(leftOrRight[0][0].getAttribute("x1")) > parseInt(leftOrRight[0][1].getAttribute("x1"))){
            var right = leftOrRight[0][0];
            var left = leftOrRight[0][1];
        }
        else{
            var right = leftOrRight[0][1];
            var left = leftOrRight[0][0];
        }

    rectangle[0][0] = top;
    rectangle[0][1] = right;
    rectangle[0][2] = bot;
    rectangle[0][3] = left;
}

function CreateMove(rectangle){
    var y = rectangle[0][0].getAttribute("y1")
    var x = rectangle[0][3].getAttribute("x1")

    if(rectangle[0][3].getAttribute("y1") === y){
        y = parseFloat(rectangle[0][3].getAttribute("y1"));
    }
    else{
        y = parseFloat(rectangle[0][3].getAttribute("y2"));
    }
    if(rectangle[0][0].getAttribute("x1") === x){
        x = parseFloat(rectangle[0][0].getAttribute("x1"));
    }
    else{
        x = parseFloat(rectangle[0][0].getAttribute("x2"));
    }

    return svg.append('rect')
        .attr('x', x + boxSize / 2)
        .attr('y', y + boxSize / 2)
        .attr('width', function(){
            var x1 = rectangle[0][0].getAttribute("x1");
            var x2 = rectangle[0][0].getAttribute("x2");
            var out = Math.abs(x1 - x2) - boxSize;
            if (out < 0){
                return 1;
            }
            else{
                return out;
            }
        })
        .attr('height', function(){
            var y1 = rectangle[0][3].getAttribute("y1");
            var y2 = rectangle[0][3].getAttribute("y2");
            var out = Math.abs(y1 - y2) - boxSize;
            if (out < 0){
                return 1;
            }
            else{
                return out;
            }
        })
        .attr("class", "active-move")
        .on("mousedown", function(){
            moving = true;
            movingCoords = d3.mouse(this);
        });
}

function PicValidation() {
    var array = [];
    for(var i = 0; i < currentPic.labelList.length; i++){
        if(currentPic.labelList[i].lines == null){
            alert("Last label has a missing rectangle, please draw it.")
            return false;
        }
        array.push(currentPic.labelList[i].li[0][0].innerText)
    }
    if (HasDuplicates(array)){
        alert("Please use unique labels")
        return false;
    }
    return true;
}

function HasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}