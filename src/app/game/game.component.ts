import { Component, OnInit } from '@angular/core';
import { makepuzzle, solvepuzzle, ratepuzzle } from "sudoku";
import pocketbase from 'pocketbase';

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

  ngOnInit(): void {
    this.generateGrid();
  }

  async generateGrid() {
    const pb = new pocketbase("https://sudoku.pockethost.io/");
    //get game data from id
    var game = await pb.collection('games').getOne(this.id);

    //@ts-ignore
    this.gridRAW = game.game.split(",");

    //instead of empty string, null
    this.gridRAW = this.gridRAW.map((e:any,i:number)=>e==""?null:e);
    //all strings to numbers
    this.gridRAW = this.gridRAW.map((e:any,i:number)=>e==null?null:parseInt(e));

    console.log(this.gridRAW);

    //from array to matrix
    console.log(ratepuzzle(this.gridRAW, 4));
    this.solved = solvepuzzle(this.gridRAW);
    this.updateGrid();
  }

  updateGrid() {
    this.grid = this.gridRAW.map((e:any,i:number)=>this.gridRAW.slice(i*this.grid_size,(i+1)*this.grid_size));
    //usergrid is a copy of grid
    this.userGrid = this.grid.map((e:any,i:number)=>this.grid.slice(i*this.grid_size,(i+1)*this.grid_size));

  }

  onKey(event:any, i:number, j:number) {
    this.userGrid[i][j] = event.target.value;
    alert(this.userGrid[i][j]);  
  }

}
