let fs = require('fs');
let path = require('path');

let result = fs.readFileSync(path.join(__dirname,'/Engelsk_Trello.json'))

result = result.toString()

result = JSON.parse(result)

function makeId(previous){
  let id = new Date().toJSON()
  if(id !== previous._id){
    return id
  }else{
    for(let i; i<100000;i++){
      console.log(1+i/i*200);
    }
    return makeId(previous)
  }
}

let cards = []

let number = 0

let previous = {}

for(card of result.cards){

  if(card.idList==='593bc3d83f2096f7856ec77f'){
    card.type = ''
  }else if (card.idList==='593bc400855c41a0ab9e72b6'){
    card.type = ''
  }else if (card.idList==='593bc3e671a2329ba41f3ff9'){
    card.type = 'verb'
  }else if (card.idList==='593bc3ec078ae1632bc72dc6'){
    card.type = 'substantiv'
  }else if (card.idList==='593c042812044410e19c2404'){
    card.type = 'adjektiv'
  }else if (card.idList==='593c040147c802a8cd4526c7'){
    card.type = 'uttale'
  }else{
    card.type = ''
  }

  /*card._id = new Date().toJSON()
  if(card._id === previous._id){
    for(let i; i<100000;i++){
      console.log(1+i/i*200);
    }
    card._id = new Date().toJSON()
  }*/
  card._id=makeId(previous)

  cards.push({term:card.name,desc:card.desc,type:card.type,_id:card._id})

  number+=1

  previous = card
}

console.log('Number',number)

//console.log(cards)

fs.writeFileSync(path.join(__dirname,'/Engelsk_Trello_ny.json'),JSON.stringify(cards))

//console.log(result)
