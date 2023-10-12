import { Component, OnInit } from '@angular/core';
import { makepuzzle, solvepuzzle, ratepuzzle } from "sudoku";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'DailySudoku';

  // sudoku grid generation 9x9
  // based on pseudo seed
  seed = "ouqwdoudoqj12810sdia";
  grid :any = [];
  grid_size = 9;

  ngOnInit(): void {
    this.generateGrid();
  }

  generateGrid() {
    this.grid =  makepuzzle();
    //from array to matrix
    this.grid = this.grid.map((e:any,i:number)=>this.grid.slice(i*this.grid_size,(i+1)*this.grid_size))

  }    

}
