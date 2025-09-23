/**
 * This document contains the JS for the main portfolio site. Comments are in JSDoc form.
 *
 * @author: Kira Miller
 */
 
$(function($) {
	
    /**
     * Accordion handler.
     */
	$(".klm-portfolio-item__summary").click(function() {		
		$(this).next(".klm-portfolio-item__demo-container").slideToggle();
	});
	

    
    
    

    /** TODO: remove this:
     * Accordion handler.
     */
	$(".accordion > .accordion-item").click(function() {		
		$(this).next(".accordion-panel").slideToggle( "slow", function() {
			// Animation complete.
		});
	});
	
	// Hide it by default:
	$(".accordion > .accordion-item").click();

    
    
	// TODO: make this better:
	$(".codesignalIcon").hover(function(){
		$(this).attr("src", "images/codesignal_hover.svg");
	}, function() {
		$(this).attr("src", "images/codesignal.svg");
	});
	$(".githubIcon").hover(function(){
		$(this).attr("src", "images/github_hover.svg");
	}, function() {
		$(this).attr("src", "images/github.svg");
	});
	$(".linkedinIcon").hover(function(){
		$(this).attr("src", "images/linkedin_hover.svg");
	}, function() {
		$(this).attr("src", "images/linkedin.svg");
	});
	$(".js-pluralsight-icon").hover(function(){
		$(this).attr("src", "images/pluralsight_hover.svg");
	}, function() {
		$(this).attr("src", "images/pluralsight.svg");
	});
	$(".stackoverflowIcon").hover(function(){
		$(this).attr("src", "images/stackoverflow_hover.svg");
	}, function() {
		$(this).attr("src", "images/stackoverflow.svg");
	});

    /**
     * My namespace for this game app. This checks for conflicting namespace names and will use the one that already exists if there is a conflict. See option 4 (best practice) of https://addyosmani.com/blog/essential-js-namespacing/#beginners I'm using the jQuery namespace pattern. See: https://www.oreilly.com/library/view/learning-javascript-design/9781449334840/ch13s04.html I've also set up the object literal here.
     *
     * @namespace
     */
    $.KirasCardMatchMemoryGame || ($.KirasCardMatchMemoryGame = {
           
        /**
         * This sets up the game for the first time after the page loads.
         *
         * @param {string} gameBoardElementId is the id name of the element on the HTML page which this function will set up the game elements into.
         * @param {string[]} relativeUrisOfUniquePicturesArray is the array containing all unique card images. The first one is the back of each card.
         */
        setupGame: function(gameBoardElementId, pageLoadingMessageContainerId, relativeUrisOfUniquePicturesArray) {
            
            // Log that we are setting up the game:
            console.log("Setting up the game.");
			
            // Add these variables to the game, and set them up with defaults for now:
            $.KirasCardMatchMemoryGame.backOfCardPictureUri = "";
			
            $.KirasCardMatchMemoryGame.cardBorderThickness = 1;
            $.KirasCardMatchMemoryGame.cardMarginWidth = 2;
            $.KirasCardMatchMemoryGame.cardWidthFullSize = 200;
            $.KirasCardMatchMemoryGame.cardWidthTabletSize = 120;
            $.KirasCardMatchMemoryGame.cardWidthMobileSize = 50;
			
            $.KirasCardMatchMemoryGame.hasOneCardBeenClicked = false;
            $.KirasCardMatchMemoryGame.hasSetupError = true; // Leave it as true in case this function returns due to a setup error. This will change to false at the end of this function.
            $.KirasCardMatchMemoryGame.isGameOver = false;
            $.KirasCardMatchMemoryGame.maxPointsGivenPerCorrectMatch = 1000;
            $.KirasCardMatchMemoryGame.maxNumberOfMatchesPossible = 0;
            $.KirasCardMatchMemoryGame.numberOfCards = 0;
            $.KirasCardMatchMemoryGame.numberOfMatchesFound = 0;
            $.KirasCardMatchMemoryGame.numberOfUniquePictures = 0;
            $.KirasCardMatchMemoryGame.pointsToDockDuringMisMatch = 1;
            $.KirasCardMatchMemoryGame.pointsToBeAwardedAfterNextMatchFound = $.KirasCardMatchMemoryGame.maxPointsGivenPerCorrectMatch;
            $.KirasCardMatchMemoryGame.previousCardsValue = "";
            $.KirasCardMatchMemoryGame.shouldIgnoreAnyClicks = true; // Ignore any user input right now until we're done setting up the game.
            $.KirasCardMatchMemoryGame.totalPointsScoredSoFar = 0;
                        
            // Arrays:
            $.KirasCardMatchMemoryGame.allCardValues = [];
            $.KirasCardMatchMemoryGame.allCardPictureUris = relativeUrisOfUniquePicturesArray;
            $.KirasCardMatchMemoryGame.allIdsOfFaceUpCards = [];
            
            // These variables will hold jQuery elements eventually:
            $.KirasCardMatchMemoryGame.$cardsContainerElement;
            $.KirasCardMatchMemoryGame.$gameBoardElement;
            $.KirasCardMatchMemoryGame.$matchesFoundCountContainerElement;
            $.KirasCardMatchMemoryGame.$messageToUserContainerElement;
            $.KirasCardMatchMemoryGame.$pageLoadingElement = $("#" + pageLoadingMessageContainerId);
            $.KirasCardMatchMemoryGame.$pointsContainerElement;
            $.KirasCardMatchMemoryGame.$statsDashboardElement;
			$.KirasCardMatchMemoryGame.$resetButtonElement;
            
            // First do some validation of the inputs:
            
            // If the gameBoardElementId is null or undefined:
            if (gameBoardElementId === undefined || gameBoardElementId === null) {
            
                // Log this error:
                console.error("The game board element id was " + gameBoardElementId + ". Cannot start game.");
                
                return;
            }
            
            // Setup access to the jQuery version of this game board element:
            $.KirasCardMatchMemoryGame.$gameBoardElement = $("#" + gameBoardElementId);

            // If the element doesn't exist:
            if ($.KirasCardMatchMemoryGame.$gameBoardElement === undefined || $.KirasCardMatchMemoryGame.$gameBoardElement === null) {
                
                // Log this error:
                console.error("The game board element doesn't exist on the page. Cannot start game.");
                
                return;
            }
            
            // Hide the gameboard, and display the loading image for now while we set it up:
            $.KirasCardMatchMemoryGame.$gameBoardElement.hide();
            $.KirasCardMatchMemoryGame.$pageLoadingElement.show();
            
            // Add a reverse reference to the DOM object:
            $.KirasCardMatchMemoryGame.$gameBoardElement.data("KirasCardMatchMemoryGame", $.KirasCardMatchMemoryGame);
            
            // If the pictures array is null or undefined:
            if (relativeUrisOfUniquePicturesArray === undefined || relativeUrisOfUniquePicturesArray === null) {
                
                // Log this error:
                console.error("The pictures array was " + relativeUrisOfUniquePicturesArray + ". Cannot start game.");
                
                return;
            }
            
            // If the number of pictures is less than 2, then we cannot have a game:
            if (relativeUrisOfUniquePicturesArray.length < 2) {
                
                // Log this error:
                console.error("There were too few pictures in the array. Cannot start game.");
                                
                return;
            }
            
            // Log that the input parameters passed validation:
            console.log("Input parameters passed validation.");
            
            // Set the number of unique pictures (minus the back-of-card picture):
            $.KirasCardMatchMemoryGame.numberOfUniquePictures = relativeUrisOfUniquePicturesArray.length - 1;

            // Set the total possible number of matches:
            $.KirasCardMatchMemoryGame.maxNumberOfMatchesPossible = $.KirasCardMatchMemoryGame.numberOfUniquePictures;

            // Set the total number of cards:
            $.KirasCardMatchMemoryGame.numberOfCards = $.KirasCardMatchMemoryGame.numberOfUniquePictures * 2;

            // Add the stats dashboard (with points, match count, and message containers) and cards container to the page:
            $.KirasCardMatchMemoryGame.$gameBoardElement.html("<div class='game-board__stats-dashboard'>"
                +     "<div class='game-board__title'>Card Match</div>"
                +     "<div class='game-board__points'></div>"
                +     "<div class='game-board__matches-found-count'></div>"
                +     "<div class='game-board__message-to-user'></div>"
                +     "<div class='game-board__reset hidden' onclick='window.location.reload();'>Play Again</div>"
                + "</div>"
                + "<div class='game-board__cards'></div>"
                );
            
            // Store these jQuery objects for future reference:
            $.KirasCardMatchMemoryGame.$statsDashboardElement = $.KirasCardMatchMemoryGame.$gameBoardElement.find(".game-board__stats-dashboard");
            $.KirasCardMatchMemoryGame.$pointsContainerElement = $.KirasCardMatchMemoryGame.$gameBoardElement.find(".game-board__points");
            $.KirasCardMatchMemoryGame.$matchesFoundCountContainerElement = $.KirasCardMatchMemoryGame.$gameBoardElement.find(".game-board__matches-found-count");
            $.KirasCardMatchMemoryGame.$messageToUserContainerElement = $.KirasCardMatchMemoryGame.$gameBoardElement.find(".game-board__message-to-user");
            $.KirasCardMatchMemoryGame.$resetButtonElement = $.KirasCardMatchMemoryGame.$gameBoardElement.find(".game-board__reset");
            $.KirasCardMatchMemoryGame.$cardsContainerElement = $.KirasCardMatchMemoryGame.$gameBoardElement.find(".game-board__cards");

            // Constrain the cards container to make the cards fit into as close a rectangle grid as possible:
            window.addEventListener("resize", $.KirasCardMatchMemoryGame.recalculateAfterResize(), false);

            // For each card:
            var cardsHTML = "";
            for (var i = 0; i < $.KirasCardMatchMemoryGame.numberOfCards; i++) {
                
                // Set up the HTML for the card. (The first URI in the array is the back of the card):
                cardsHTML += "<div id='cardId" + i 
					+ "' class='game-board__single-card selectable' onclick='$.KirasCardMatchMemoryGame.cardClicked(" + i
					+ ")'><img src='" + relativeUrisOfUniquePicturesArray[0] + "' /></div>";
            
                // Set up the card's face value into the array. At first, this will be in order; first two cards match, next two cards match, etc. They will be shuffled by the reset function:
                $.KirasCardMatchMemoryGame.allCardValues.push(relativeUrisOfUniquePicturesArray[Math.floor((i + 2)/2)]);
            }
            
            // Add all cards to the page, within the cards container:
            $.KirasCardMatchMemoryGame.$cardsContainerElement.html(cardsHTML);

            // When it gets to this point, it means no errors were encountered:
            $.KirasCardMatchMemoryGame.hasSetupError = false;

            // Log that we are done setting up the game:
            console.log("Finished setting up the game.");
            
            // Reset (to shuffle cards and set up messages) to start the game:
            $.KirasCardMatchMemoryGame.resetGame();            
        },

        /**
         * This recalculates the width of the cards container upon a screen / window resize event to ensure the cards form an asthetically pleasing rectangular shape.
         */
        recalculateAfterResize: function() {
			
			// TODO: move most css for this game to this JS. Alternative is to use SASS since CSS doesn't do loops / conditionals. But for this project, I want to focus on jQuery.
			// TODO: fix this. Currently it's stuck in a loop:
			return;
            
            let cardsContainerWidth = 0;
            let screenWidth = screen.width;
            let totalCardWidth = 206;
            
			$.KirasCardMatchMemoryGame.cardWidthFullSize
			
            if (screen.width <= 400) {
                // Then it's a tiny mobile size screen:
                totalCardWidth = 206;
                
            } else if (401 <= screen.width && screen.width <= 1350) {
                // Then it's a tablet size
                totalCardWidth = 206;
                
            } else {
                // Then it's wider than 1350px:
                totalCardWidth = 206;
            }
			
			// Start off considering the longest possible container with all the cards in a straight line:
			cardsContainerWidth = totalCardWidth * $.KirasCardMatchMemoryGame.numberOfCards + 1;
			
			// As long as this container width is larger than the screen width:
			while (cardsContainerWidth >= screenWidth) {
				cardsContainerWidth = cardsContainerWidth / 2;
				// cut it in half? or make it fit a rectangle as best as possible.
				// maybe half at first, and if its still too big, cut that in half. If too small, ?
			}
			
			$.KirasCardMatchMemoryGame.$cardsContainerElement.css("width", cardsContainerWidth);
			
            
            ;
            
            // TODO
            // sense the width of the screen
            // calc the width of each card img + margin + border
            // find the max width of cardscontainer possible to make as close a rectangle with the cards
            
            // examples:
            
            // screenWidth = 1351
            // cardWidth = 206
            // numCards = 2
            // cardsContainerWidth = cardWidth*numCards + 1
            
            // screenWidth = 1351
            // cardWidth = 206
            // numCards = 4
            // cardsContainerWidth = cardWidth*numCards + 1
            
            // screenWidth = 1351
            // cardWidth = 206
            // numCards = 6
            // cardsContainerWidth = cardWidth*numCards + 1
            
            // screenWidth = 1351
            // cardWidth = 206
            // numCards = 8
            // cardsContainerWidth = cardWidth*numCards / 2 + 1
            
            // screenWidth = 1351
            // cardWidth = 206
            // numCards = 10
            // cardsContainerWidth = cardWidth*numCards / 2 + 1
            
        },
        
        /**
         * This resets the game; shuffles the cards, sets the points accumulated to 0, resets the messages, and re/starts the game.
         */
        resetGame: function() {
            // Log that we are resetting the game:
            console.log("Resetting the game.");
            
            // Ignore any user input right now until we're done setting up the game:
            $.KirasCardMatchMemoryGame.shouldIgnoreAnyClicks = true; 
           
            // Hide the gameboard for now while we set it up:
            $.KirasCardMatchMemoryGame.$gameBoardElement.hide();
            $.KirasCardMatchMemoryGame.$pageLoadingElement.show();
            
            // If there was a problem during setup:
            if($.KirasCardMatchMemoryGame.hasSetupError) {
                
                // Log the error and quit the game:
                console.error("Cannot start game due to a setup error.");
                
                // Display an error to the user:
                $.KirasCardMatchMemoryGame.$messageToUserContainerElement.html("Sorry, something went wrong. Please go back and try again.");
                    
                // Show the gameboard:
                $.KirasCardMatchMemoryGame.$gameBoardElement.show();
                
                // Hide the loader:
                $.KirasCardMatchMemoryGame.$pageLoadingElement.hide();
                
                return;
            }
            
            // Reset points to 0:
            $.KirasCardMatchMemoryGame.totalPointsScoredSoFar = 0;
            
            // Reset the points display to user:
            $.KirasCardMatchMemoryGame.$pointsContainerElement.html("Total points: " + $.KirasCardMatchMemoryGame.totalPointsScoredSoFar);
            
            // Reset next possible points to highest possible. (The game subtracts points from this for each mismatch the user does, until a correct match is found):
            $.KirasCardMatchMemoryGame.pointsToBeAwardedAfterNextMatchFound = $.KirasCardMatchMemoryGame.maxPointsGivenPerCorrectMatch; 
            
            // Reset the array that keeps track of all face-up cards:
            $.KirasCardMatchMemoryGame.allIdsOfFaceUpCards = [];
            
            // Reset the number of matches the user found to 0:
            $.KirasCardMatchMemoryGame.numberOfMatchesFound = 0;
            
            // Reset the matches display to the user:
            $.KirasCardMatchMemoryGame.$matchesFoundCountContainerElement.html("Number of matches found: " + $.KirasCardMatchMemoryGame.numberOfMatchesFound);
            
            // Set all cards to their face-down display:
            $.KirasCardMatchMemoryGame.$cardsContainerElement.find("img").attr("src", $.KirasCardMatchMemoryGame.allCardPictureUris[0]);
            
            // For each card:
            for(var i = 0; i < $.KirasCardMatchMemoryGame.numberOfCards; i++) {
           
                // Randomly shuffle their face value with another card's:
                var j = Math.floor(Math.random() * $.KirasCardMatchMemoryGame.numberOfCards);
                
                // Swap:
                var temporaryFaceUpPictureUri = $.KirasCardMatchMemoryGame.allCardValues[i];
                $.KirasCardMatchMemoryGame.allCardValues[i] = $.KirasCardMatchMemoryGame.allCardValues[j];
                $.KirasCardMatchMemoryGame.allCardValues[j] = temporaryFaceUpPictureUri;
            }
            
            // Set the initial message:
            $.KirasCardMatchMemoryGame.$messageToUserContainerElement.html("Let's begin! Click on a card to turn it over.");
                                
            // Show the gameboard:
            $.KirasCardMatchMemoryGame.$gameBoardElement.show();
            $.KirasCardMatchMemoryGame.$pageLoadingElement.hide();
            
            // We're done resetting, so pay attention to user input now:
            $.KirasCardMatchMemoryGame.shouldIgnoreAnyClicks = false; 
            
            // Log that we are done resetting the game:
            console.log("Finished resetting the game. Game has started.");
        },
        
        /**
         * This handles when a card is clicked on.
         *
         * @param {number} clickedCardId is the id of the card which was clicked on.
         */
        cardClicked: function(clickedCardId) {
            
            // Log action:
            console.log("Card with Id " + clickedCardId + " was clicked.");
            
            // If the game had a setup error:            
            if($.KirasCardMatchMemoryGame.hasSetupError) {
                
                // Then ignore this click:
                console.log("Ignoring click; game had a setup error.");
                
                return;
            }
            
            // If the game isn't ready for user input (due to setup or transition, etc.):
            if($.KirasCardMatchMemoryGame.shouldIgnoreAnyClicks) {
                
                // Then ignore this click:
                console.log("Ignoring click; game isn't ready for user input yet.");
                
                return;
            }
            
            // Otherwise, set this to ignore subsequent clicks for now:
            console.log("Set to ignore subsequent clicks.");
            $.KirasCardMatchMemoryGame.shouldIgnoreAnyClicks = true;
            
            // If the game is over:
            if($.KirasCardMatchMemoryGame.isGameOver) {
                
                // Then ignore this click:
                console.log("Ignoring click; game is over.");
                
                return;
            }
            
            // If the card that was clicked is already face-up:
            if($.KirasCardMatchMemoryGame.allIdsOfFaceUpCards.includes(clickedCardId)) {
                
                // Then ignore this click:
                console.log("Ignoring click; this card is already face up.");
                
                // We're done, so pay attention to user input again:
                console.log("Paying attention to clicks again now.");
                $.KirasCardMatchMemoryGame.shouldIgnoreAnyClicks = false;
                
                return;
            }
            
            console.log("Showing card's face.");
            
            // Otherwise, mark this card as face up now:
            $.KirasCardMatchMemoryGame.allIdsOfFaceUpCards.push(clickedCardId);
            
            var thisCardsValue = $.KirasCardMatchMemoryGame.allCardValues[clickedCardId];
            
            // Display the face-up value on this clicked card:
            $("#cardId" + clickedCardId + " img").attr("src", thisCardsValue);
		
			// Remove the highlight effect from it:
			$("#cardId" + clickedCardId).removeClass("selectable");
			
            // If this is the first card they've turned over in this match round:
            if($.KirasCardMatchMemoryGame.previousCardsValue === "") {
                
                // Make this the previous card for next time:
                $.KirasCardMatchMemoryGame.previousCardsValue = thisCardsValue;				
                
                // Update the message to the user:
                $.KirasCardMatchMemoryGame.$messageToUserContainerElement.html("Now pick a matching card.");
                
                // We're done, so pay attention to user input again:
                console.log("Paying attention to clicks again now.");
                $.KirasCardMatchMemoryGame.shouldIgnoreAnyClicks = false;
                
            } else {
                
                // If this card's value is the same as the previously clicked card:
                if(thisCardsValue === $.KirasCardMatchMemoryGame.previousCardsValue) {
                
                    // Then it's a match:
                    console.log("Cards did match.");
					
                    // Keep both cards face up and add reward to total points:
                    $.KirasCardMatchMemoryGame.totalPointsScoredSoFar += $.KirasCardMatchMemoryGame.pointsToBeAwardedAfterNextMatchFound;
                    
                    // Reset possible points for the next match:
                    $.KirasCardMatchMemoryGame.pointsToBeAwardedAfterNextMatchFound = $.KirasCardMatchMemoryGame.maxPointsGivenPerCorrectMatch;
                    
                    // Reset previous card for next match:
                    $.KirasCardMatchMemoryGame.previousCardsValue = "";
                    
                    // Increment the number of matches the user has found:
                    $.KirasCardMatchMemoryGame.numberOfMatchesFound++;
                    
                    // Display this message to the user:
                    $.KirasCardMatchMemoryGame.$messageToUserContainerElement.html("Great! You found a match! Choose another face-down card to find another match.");
                    
                    // Update the points display to user:
                    $.KirasCardMatchMemoryGame.$pointsContainerElement.html("Total points: " + $.KirasCardMatchMemoryGame.totalPointsScoredSoFar);
                    
                    // Update matches found display:
                    $.KirasCardMatchMemoryGame.$matchesFoundCountContainerElement.html("Number of matches found: " + $.KirasCardMatchMemoryGame.numberOfMatchesFound);
            
                    // If the user has found all possible matches:
                    if($.KirasCardMatchMemoryGame.numberOfMatchesFound >= $.KirasCardMatchMemoryGame.maxNumberOfMatchesPossible) {
            
                        // Then the game is over:
                        $.KirasCardMatchMemoryGame.isGameOver = true;
                        
						// Show the reset button:
						$.KirasCardMatchMemoryGame.$resetButtonElement.removeClass("hidden");
						
                        // Display this message to the user:
                        $.KirasCardMatchMemoryGame.$messageToUserContainerElement.html("Congratulations! You found all the matches!");
                    }

                    // We're done, so pay attention to user input again:
                    console.log("Paying attention to clicks again now.");
                    $.KirasCardMatchMemoryGame.shouldIgnoreAnyClicks = false;
                    
                } else {
                    
                    // It's not a match:
                    console.log("Cards did not match.");
                    
                    // So dock some points from the possible prize:
                    $.KirasCardMatchMemoryGame.pointsToBeAwardedAfterNextMatchFound -= $.KirasCardMatchMemoryGame.pointsToDockDuringMisMatch;
                    
                    // If it's less than 1:
                    if($.KirasCardMatchMemoryGame.pointsToBeAwardedAfterNextMatchFound < 1) {
                        
                        // Keep it at 1 so they get at least 1 point for finding a match:
                        $.KirasCardMatchMemoryGame.pointsToBeAwardedAfterNextMatchFound = 1;
                    }
                    				
                    // Display this message to the user:
                    $.KirasCardMatchMemoryGame.$messageToUserContainerElement.html(":( Sorry, those cards do not match.");
                    
                    // Wait 3 seconds and then flip both cards back over:
                    setTimeout(function(){
                        
                        // Remove both cards from the face-up card tracker stack:
                        $.KirasCardMatchMemoryGame.allIdsOfFaceUpCards.pop();
                        var previousCardId = $.KirasCardMatchMemoryGame.allIdsOfFaceUpCards.pop();
							
						// Add the highlight effect back:
						$("#cardId" + clickedCardId).addClass("selectable");
						$("#cardId" + previousCardId).addClass("selectable");
                        
                        // Re-hide both cards:
                        $("#cardId" + clickedCardId + " img").attr("src", $.KirasCardMatchMemoryGame.allCardPictureUris[0]);
                        $("#cardId" + previousCardId + " img").attr("src", $.KirasCardMatchMemoryGame.allCardPictureUris[0]);
                        
                        // Reset previous card for next match:
                        $.KirasCardMatchMemoryGame.previousCardsValue = "";
                            
                        // Display this message to the user:
                        $.KirasCardMatchMemoryGame.$messageToUserContainerElement.html(":( Sorry, those cards did not match. Pick another face-down card to try again.");
                                    
                        // We're done, so pay attention to user input again:
                        console.log("Paying attention to clicks again now.");
                        $.KirasCardMatchMemoryGame.shouldIgnoreAnyClicks = false;
                    
                    }, 3000);
                }
            }                        
        }
        
    });
    
    // temporary array for testing:
    var relativeUrisOfUniquePicturesArray = [ "images/backOfCard.svg", "images/appleGreen.svg", "images/cherriesRed.svg", "images/peachOrange.svg", "images/pearYellow.svg", "images/plumPurple.svg" ];
    
    // Setup and start the game:
    $.KirasCardMatchMemoryGame.setupGame("game-board", "loading-message-container", relativeUrisOfUniquePicturesArray);
    
	// Hide it by default:
	$(".klm-portfolio-item__summary").each().click();
    
	
});