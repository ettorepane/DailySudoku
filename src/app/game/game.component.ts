import { Component, OnInit } from '@angular/core';
import { makepuzzle, solvepuzzle, ratepuzzle } from "sudoku";
import pocketbase from 'pocketbase';
import timer from 'easytimer.js';
import { Cron } from "croner";


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  title = 'DailySudoku';
  //game id taken from url
  id = window.location.pathname.split("/")[2];
  // sudoku grid generation 9x9
  // based on pseudo seed
  grid :any = [];
  gridRAW :any = [];
  grid_size = 9;
  solved :any = [];
  userGrid :any = [];

  cheatON = false;

  toggleCheat(){
    this.cheatON = !this.cheatON;
    if(this.cheatON){
      alert("Cheat mode ON");
    }
    else{
      alert("Cheat mode OFF");
    }
  }

  ngOnInit(): void {
    this.generateGrid();
  }

  showSolution = false;
  correctSudoku(){
    this.showSolution = true;
    this.timerInstance.pause();
  }
  loading = true;
  timerInstance = new timer();
  async generateGrid() {
    const pb = new pocketbase("https://sudoku.pockethost.io/");
    //get game data from shortID

    var game = await pb.collection('games').getFirstListItem('shortID="'+this.id+'"');

    //@ts-ignore
    this.gridRAW = game.game.split(",");

    //instead of empty string, null
    this.gridRAW = this.gridRAW.map((e:any,i:number)=>e==""?null:e);
    //all strings to numbers
    this.gridRAW = this.gridRAW.map((e:any,i:number)=>e==null?null:parseInt(e));

    //all grid element +1

    console.log(this.gridRAW);

    //from array to matrix
    console.log(ratepuzzle(this.gridRAW, 4));
    this.solved = solvepuzzle(this.gridRAW);

    this.gridRAW = this.gridRAW.map((e:any,i:number)=>e==null?null:e+1);
    this.solved = this.solved.map((e:any,i:number)=>e+1);

    this.updateGrid();
    this.loading = false;
    this.checkStarted();
    //every 5 sec 
    setInterval(()=>this.checkStarted(), 3000);
  }

  gameStarted = false;
  
  async checkStarted() {
    if(this.gameStarted == true){
      return;
    }
    console.log("checking started");
    const pb = new pocketbase("https://sudoku.pockethost.io/");
    //get game data from shortID
    await pb.collection('games').getFirstListItem('shortID="'+this.id+'"').then((game:any)=>{
      //@ts-ignore
      if(game.started == true){
        this.timerInstance.start(/* config */);
        this.gameStarted = true;
      }
    });

  }

  updateGrid() {
    this.grid = this.gridRAW.map((e:any,i:number)=>this.gridRAW.slice(i*this.grid_size,(i+1)*this.grid_size));
    //usergrid is a copy of grid
    this.userGrid = this.grid.map((e:any,i:number)=>this.grid.slice(i*this.grid_size,(i+1)*this.grid_size));
    this.solved = this.solved.map((e:any,i:number)=>this.solved.slice(i*this.grid_size,(i+1)*this.grid_size));
    console.log(this.grid);
    console.log(this.userGrid);
  }

  onKey(event:any, i:number, j:number) {
    this.userGrid[i][j] = event.target.value;
    if(event.target.value == "'" && this.cheatON){
      //this is a cheat, do not tell anyone
      this.userGrid[i][j] = this.solved[i][j];
      //also update the input
      event.target.value = this.solved[i][j];
    }
  }


}
