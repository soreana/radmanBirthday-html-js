var view = {
	displayMessage : function ( message ){
		var cell = document.getElementById( "messageArea" );
		cell.innerHTML = message;
	},

	displayMiss : function (location){
		var cell = document.getElementById( location );
		cell.setAttribute( "class" , "miss" );
	},

	displayHit : function ( location ) {
		var cell = document.getElementById ( location );
		cell.setAttribute( "class" , "hit" );
	}
};

var model = {
	boardSize: 7 ,
	numShips: 3 ,
	shipsSunk: 0 ,
	shipLength: 3 ,

	ships : [ { location: [ "0" , "0" , "0" ] , hits: [ "" , "" , "" ] } ,
		  { location: [ "0" , "0" , "0" ] , hits: [ "" , "" , "" ] } ,
		  { location: [ "0" , "0" , "0" ] , hits: [ "" , "" , "" ] }
		],

	fire: function ( guess ){

		for( var i=0 ; i< this.numShips ; i++ ){
			var ship = this.ships[ i ];
			var location = ship.location ;
			var index = location.indexOf( guess );
			if( index >= 0  ){
				ship.hits[ index ] = "hits" ;
				view.displayHit( guess );
				view.displayMessage( "HIT!" );

				if( this.isSunk( ship ) ){
					view.displayMessage ( "You sank my battleship!");
					this.shipsSunk ++ ;
				}
				return true;
			}
		}
		view.displayMiss( guess );
		view.displayMessage( "You missed." );
		return false;
	} ,

	isSunk: function ( ship ){
		for( var i = 0 ; i< this.shipLength ; i++  )
			if( ship.hits[ i ] !== "hits" )
				return false;
		return true;
	} ,

	generateShips : function (){
		var location ;
		for( var i = 0 ; i < this.numShips ; i++ ){
			do{
				location = this.generateShip();
			}while ( this.collision ( location ) );
			this.ships[i].location = location ;
		}
	} ,

	generateShip : function (){
		var direction = Math.floor( Math.random() * 2 ) ;
		var row , column ;

		if( direction === 1 ){ // horizontal
			row = Math.floor( Math.random() * this.boardSize  );
			column = Math.floor( Math.random() * ( this.boardSize - this.shipLength ) );
		}else {
			row = Math.floor( Math.random() * ( this.boardSize - this.shipLength ) );
			column = Math.floor( Math.random() * this.boardSize  );
		}

		var newShipLocation = [] ;
		for( var i = 0 ; i< this.shipLength ; i++ ){
			if( direction === 1 ){
				newShipLocation.push( row + "" + (column + i ) ); 
			}
			else {
				newShipLocation.push( (row + i ) + "" + column ); 
			}
		}
		return newShipLocation ;
	} ,

	collision : function ( location ) {
		for( var i = 0 ; i< this.numShips ; i++ ){
			var ship = this.ships[i];
			for( var j=0 ; j< this.shipLength ; j++){
				if( ship.location.indexOf ( location[ j ] ) >= 0 )
					return true;
			}
		}
		return false;
	}
};

var controller = {
	guesses : 0,

	cellClick : function ( cellId){
		this.guesses ++ ;
		var hit = model.fire( cellId );


		if( hit && model.shipsSunk === model.numShips )
			view.displayMessage( "You sank all my battleships in " + this.guesses + " guesses." );
	} ,

	processGuess : function ( guess ){
		var location = this.parseGuess( guess ) ;

		if( !location )
			return;

		this.guesses ++ ;
		var hit = model.fire( location );


		if( hit && model.shipsSunk === model.numShips )
			view.displayMessage( "You sank all my battleships in " + this.guesses + " guesses." );
	} ,

	parseGuess : function( guess ) {
		var alphabet = [ "A" , "B" , "C" , "D" , "E" , "F" , "G" ];

		if( guess === null || guess.length !== 2 ){
			alert( "Oops! ,please enter a letter and number on the board." );
			return null ;
		}

		var row = alphabet.indexOf( guess.charAt( 0 ) );
		var column = guess.charAt( 1 );

		if( isNaN( row ) || isNaN ( column ) ){
			alert( "Oops , that isn't on the board." );
			return null;
		}

		if( row > model.boardSize || row < 0 || column >= model.boardSize || column < 0 ){
			alert( "Oops , that is off the board." );
			return null;
		}

		return row + column ;
	}
};

function init () {
	//var fireButton = document.getElementById( "firstButton" );
	//fireButton.onclick = handleFireButton ;

	//var guessInput = document.getElementById( "guessInput" );
	//guessInput.onkeypress = handleKeyPress  ;

	model.generateShips();

	var cell = document.getElementsByTagName ( "td" );
	for( var i = 0 ; i< cell.length ; i ++ )
		cell[i].onclick = handleCellClick;
}

function handleCellClick ( eventObj ) {
	controller.cellClick ( eventObj.target.id );
}

function handleFireButton () {
	var guessInput = document.getElementById( "guessInput" );
	var guess = guessInput.value ;

	controller.processGuess ( guess );

	guessInput.value = "" ;
}

function handleKeyPress( e ){
	var fireButton = document.getElementById( "firstButton" );
	if( e.keyCode === 13 ){
		fireButton.click();
		return false ;
	}
}

window.onload = init ;
