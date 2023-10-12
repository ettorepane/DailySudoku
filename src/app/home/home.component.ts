import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { makepuzzle, solvepuzzle, ratepuzzle } from "sudoku";
import pocketbase from 'pocketbase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  gameCreatedID = "";

  async createGame() {
    const pb = new pocketbase("https://sudoku.pockethost.io/");
    var game = await makepuzzle();
    var solved = solvepuzzle(game);
    var easierVersion = game;
    console.log(game);
    //this are two arrays, make an easier version of the game by filling in some of the blanks
    for (var i = 0; i < 81; i++) {
      if (easierVersion[i] == null && Math.random() < 0.3) {
        easierVersion[i] = solved[i];
      }
    }
    //game needs to be json
    var data = {
      game: easierVersion.toString(),
      solved: solved
    }
    const record = await pb.collection('games').create(data);
    //goto game/:id
    this.gameCreatedID = record.id;
    window.location.href = "/game/" + record.id;
  }

}
