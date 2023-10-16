import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { makepuzzle, solvepuzzle, ratepuzzle } from "sudoku";
import pocketbase from 'pocketbase';
import {MatSliderModule} from '@angular/material/slider';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor( private router: Router) { }


  gameCreatedID = "";
  shortID = "";
  ownerToken = "";

  difficultySlider = 60;


  async createGame() {
    const pb = new pocketbase("https://sudoku.pockethost.io/");
    var game = await makepuzzle();
    var solved = solvepuzzle(game);
    var easierVersion = game;
    console.log(game);
    //this are two arrays, make an easier version of the game by filling in some of the blanks
    var difficulty = (100 - this.difficultySlider) / 100;
    for (var i = 0; i < 81; i++) {
      if (easierVersion[i] == null && Math.random() < difficulty) {
        easierVersion[i] = solved[i];
      }
    }
    //customID made with alphanumeric characters A-Z, 0-9.
    //length 7
    var shortID = "";
    var possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
    for (var i = 0; i < 7; i++)
      shortID += possible.charAt(Math.floor(Math.random() * possible.length));
    this.shortID = shortID;
    console.log(shortID);
    this.ownerToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    //expiry 24h
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 1);
    var data = {
      OwnerToken: this.ownerToken,
      expiry: expiry,
      shortID: shortID,
      game: easierVersion.toString(),
      solved: solved
    }
    const record = await pb.collection('games').create(data);
    //goto game/:id
    this.gameCreatedID = record.id;
  }


  formatLabel(value: number): string {
    switch (value) {
      case 20:
        return 'Beginner';
      case 40:
        return 'Easy';
      case 60:
        return 'Medium';
      case 80:
        return 'Hard';
      case 100:
        return 'Expert';
      default:
        return '';
    }
  }

  async startGame() {
    const pb = new pocketbase("https://sudoku.pockethost.io/");
    //set started to true
    var update = await pb.collection('games').update(this.gameCreatedID, { started: true });

    this.router.navigate(['/game', this.shortID]);

  }



}


