Vue.component('player-collapse', {
    template: `
        <div class="card" >

            <div class="card-header head1" role="tab" v-bind:id="'heading'+index" v-on:click="editTheHeights" >

                <a id="link1" class="collapsed" data-toggle="collapse" v-bind:href="'#collapse'+ index" aria-expanded="false" v-bind:aria-controls="'collapse'+index">

                    <div id="mainTextCSS" >
                       {{maintext}} 
                    </div>

                </a>

            </div>

            <div v-bind:id="'collapse'+index" class="collapse" role="tabpanel" v-bind:aria-labelledby="'heading'+index">

                <div id="collapseTextCSS" class="card-body">

                    {{collapsetext}}

                </div>

            </div>
            
        </div>
    `,

    props: ['maintext','collapsetext', 'index', 'expanded'],

    methods: {
        editTheHeights: function(){
            console.log('Did it')
            this.$emit('edit-heights');
            
        }
    }
  
})
// Creating new Vue
var mainVue = new Vue({
    el: '#vue1',
    // When refreshing the page, make sure our array of task objects, tasksToDo, is the same as the one in the database
    // beforeCreate() {

    //     $.get('/currentPlayersSearched', function(dataFromServer) {
    //         console.log(dataFromServer);
    //         // dataFromServer is an array of task objects with taskDescription property and isCompleted property
    //         mainVue.playersSearched = dataFromServer;
    //     })
    // },
    data: {
        searchedPlayersArr: [],

        heightTop: 60,
        heightRow5: 20,
        heightTabList: 15,

        searchedQBsArr: [],
        searchedRBsArr: [],
        searchedWRsArr: [],
        searchedTEsArr: [],
        searchedKsArr: [],
        searchedPsArr: [],
        searchedGsArr: [],
        searchedTsArr: [],
        searchedCsArr: [],
        searchedLSsArr: [],

        searchedDTsArr: [],
        searchedDEsArr: [],
        searchedLBsArr: [],
        searchedCBsArr: [],
        searchedSsArr: [],

        // info to pass to server on the front-end
        positionsString : "",
        playerNameString: '',
        nameToPass: '',
        teamsString: '',
        teamsArr: [],
        positionsString: '',
        positionsArr: [],

        playersSearched: [],

        //WR
        recYards: 0,

        // NFC West
        azIsChecked : false,
        seattleIsChecked: false,
        sanFranIsChecked: false,
        ramsIsChecked: false,

        // NFC East
        eaglesIsChecked : false,
        cowboysIsChecked: false,
        redskinsIsChecked: false,
        giantsIsChecked: false,

        // NFC South
        saintsIsChecked : false,
        falconsIsChecked: false,
        bucsIsChecked: false,
        panthersIsChecked: false,

        // NFC North
        packersIsChecked : false,
        vikingsIsChecked: false,
        lionsIsChecked: false,
        bearsIsChecked: false,

        // AFC West
        cheifsIsChecked : false,
        broncosIsChecked: false,
        raidersIsChecked: false,
        chargersIsChecked: false,

        // AFC East
        patsIsChecked : false,
        dolphinsIsChecked: false,
        billsIsChecked: false,
        jetsIsChecked: false,

        // AFC South
        jagsIsChecked : false,
        titansIsChecked: false,
        coltsIsChecked: false,
        texansIsChecked: false,

        // AFC North
        steelersIsChecked : false,
        ravensIsChecked: false,
        bengalsIsChecked: false,
        brownsIsChecked: false,

        // Offensive Positions
        qbIsChecked: false,
        rbIsChecked: false,
        wrIsChecked: false,
        teIsChecked: false,
        kIsChecked: false,
        pIsChecked: false,
        cIsChecked: false,
        tIsChecked: false,
        gIsChecked: false,
        lsIsChecked: false,

        // Defensive Positions 
        dtIsChecked: false,
        deIsChecked: false,
        lbIsChecked: false,
        cbIsChecked: false,
        sIsChecked: false


    },
    methods: {

        search: function(event){

             console.log('button clicked');

            // Checking to see if a player name was entered, and if so, formating player string to pass to server
            if( this.playerNameString !== ''){
                // remformating name input
                // turn string into an array, get rid of spaces ' '
                var playerNameArr = mainVue.playerNameString.split(" ");
                //get rid of spaces and format 
                for(var i = 0; i < playerNameArr.length; i++) {
                    if( playerNameArr[i] === ''){
                        playerNameArr.splice(i, 1);
                        i--;
                    }
                }
                // add dash if necessary
                if(playerNameArr.length > 1){
                    this.nameToPass  = playerNameArr[0] + '-' + playerNameArr[1];
                } else {
                    this.nameToPass = playerNameArr[0];
                };
            }
            // Making teams string to pass to server
            this.teamsString = this.teamsArr.join();
            console.log(this.teamsString);

            // Making positions string to pass to server
            this.positionsString = this.positionsArr.join();
            console.log(this.positionsString);

            // Info to send to server
            var info = {
                playerName: this.nameToPass,
                teams: this.teamsString,
                positions: this.positionsString
            }

            $.post('/search', info, function(dataObj){

                if(dataObj === 'No fields specified'){
                    alert("You must specify at least one field");
                }

                // add searched players to searchedPlayersArr
                var searchedPlayersArr = dataObj.cumulativeplayerstats.playerstatsentry;

                // add expanded property to each player object, for prop inside Vue component, set to default (false)
                for(var i = 0; i < searchedPlayersArr.length; i++){
                    searchedPlayersArr[i].expanded = false;
                }

                // Edit heights of elements in HTML
                mainVue.editHeights(searchedPlayersArr);

                // add each players to their position array
                mainVue.sortByPosition(searchedPlayersArr);

                //sort searched players so best players come up first
                mainVue.sortPositionsArrays();

                // add mainText and collapseText properties for each player object for displaying player
                mainVue.addTextProps();

                console.log(dataObj);

            }) // End $.post

        }, // End search function

        editHeights: function(arrOfPlayers){
            var numCards = arrOfPlayers.length;
            var cardHeight = 5.05;
            var remToAdd = numCards * cardHeight;
            this.heightTop += remToAdd;
            this.heightRow5 += remToAdd;
            this.heightTabList += remToAdd;

        },
        editHeights2: function(player){
            console.log("made it here")
            // editing heights of containers when collapse is clicked, to avoid overflow
            if(player.expanded === false){
                player.expanded = true;
                this.heightTop += 7;
                this.heightRow5 += 7;
                this.heightTabList += 7;
            }
            // remove extra height when collapse is hidden
            if(player.expanded === true){
                player.expanded = false;
                this.heightTop -= 7;
                this.heightRow5 -= 7;
                this.heightTabList -= 7;
            }
        },

        // editHeights2: function(){
        //     
        //     // this function found in Vue component on click
        //     this.heightTop += 4;
        //     this.heightRow5 += 4;
        //     this.heightTabList += 4;
        // },

        sortByPosition: function(arrOfPlayers){
            // sort by position
            for(var i = 0; i < arrOfPlayers.length; i++){

                var player1 = arrOfPlayers[i];
                var playerPosition = arrOfPlayers[i].player.Position;

                // Grouping searched players by position

                if(playerPosition === 'QB'){
                    this.searchedQBsArr.push(player1);
                } else if((playerPosition === 'RB') || (playerPosition === 'FB')) {
                    this.searchedRBsArr.push(player1);

                } else if (playerPosition === 'WR'){
                    this.searchedWRsArr.push(player1);

                } else if (playerPosition === 'TE'){
                    this.searchedTEsArr.push(player1);

                } else if (playerPosition === 'K'){
                    this.searchedKsArr.push(player1);

                } else if (playerPosition === 'P'){
                    this.searchedPsArr.push(player1);

                } else if (playerPosition === 'C'){
                    this.searchedCsArr.push(player1);

                } else if (playerPosition === 'G'){
                    this.searchedGsArr.push(player1);

                } else if ((playerPosition === 'T') || (playerPosition === 'OT')){
                    this.searchedTsArr.push(player1);

                } else if (playerPosition === 'LS'){
                    this.searchedLSsArr.push(player1);

                }else if ((playerPosition === 'DT') || (playerPosition === 'NT')){
                    this.searchedDTsArr.push(player1);

                } else if (playerPosition === 'DE') {
                    this.searchedDEsArr.push(player1);

                } else if ( (playerPosition === 'LB') || (playerPosition === 'OLB') || (playerPosition === 'ILB') || (playerPosition === 'MLB') ){
                    this.searchedLBsArr.push(player1);

                } else if ((playerPosition === 'CB') || (playerPosition === 'DB')){
                    this.searchedCBsArr.push(player1);

                } else if ((playerPosition === 'SS') || (playerPosition === 'FS')){
                    this.searchedSsArr.push(player1);

                } 
            }
        },
        sortPositionsArrays: function(){

            // sort QBs so ones with most pass yards in the lowest indexes
            if(this.searchedQBsArr.length > 1){
                this.searchedQBsArr.sort(function(a,b){
                return (Number(a.stats.PassYards['#text']) - Number(b.stats.PassYards['#text']))
                })
                this.searchedQBsArr.reverse();
            }
            //sort RBs by most rush yards
            if(this.searchedRBsArr.length > 1){
                this.searchedRBsArr.sort(function(a,b){
                return (Number(a.stats.RushYards['#text']) - Number(b.stats.RushYards['#text']))
                })
            }
            //sort WRs by most rec yards
            if(this.searchedWRsArr.length > 1){
                this.searchedWRsArr.sort(function(a,b){
                return (Number(a.stats.RecYards['#text']) - Number(b.stats.RecYards['#text']))
                })
            }
            // sort TEs by most rec yards
            if(this.searchedTEsArr.length > 1){
                this.searchedTEsArr.sort(function(a,b){
                return (Number(a.stats.RecYards['#text']) - Number(b.stats.RecYards['#text']))
                })
            }
            // sort Ks by FG percentage
            if(this.searchedKsArr.length > 1){
                this.searchedKsArr.sort(function(a,b){
                return (Number(a.stats.FgPct['#text']) - Number(b.stats.FgPct['#text']))
                })
            }
            // sort Ps by Avg punt length
            if(this.searchedKsArr.length > 1){
                this.searchedKsArr.sort(function(a,b){
                return (Number(a.stats.PuntAvg['#text']) - Number(b.stats.PuntAvg['#text']))
                })
            }
            // sort Cs by Games Played
            if(this.searchedKsArr.length > 1){
                this.searchedKsArr.sort(function(a,b){
                return (Number(a.stats.GamesPlayed['#text']) - Number(b.stats.GamesPlayed['#text']))
                })
            }
            // sort Gs by Games Played
            if(this.searchedGsArr.length > 1){
                this.searchedGsArr.sort(function(a,b){
                return (Number(a.stats.GamesPlayed['#text']) - Number(b.stats.GamesPlayed['#text']))
                })
            }
            // sort Ts by Games Played
            if(this.searchedTsArr.length > 1){
                this.searchedTsArr.sort(function(a,b){
                return (Number(a.stats.GamesPlayed['#text']) - Number(b.stats.GamesPlayed['#text']))
                })
            }
            // sort LSs by Games Played
            if(this.searchedDEsArr.length > 1){
                this.searchedDEsArr.sort(function(a,b){
                return (Number(a.stats.GamesPlayed['#text']) - Number(b.stats.GamesPlayed['#text']))
                })
            }
            // sort DTs by Sacks
            if(this.searchedDTsArr.length > 1){
                this.searchedDTsArr.sort(function(a,b){
                return (Number(a.stats.Sacks['#text']) - Number(b.stats.Sacks['#text']))
                })
            }
            // sort DEs by Sacks
            if(this.searchedDEsArr.length > 1){
                this.searchedDEsArr.sort(function(a,b){
                return (Number(a.stats.Sacks['#text']) - Number(b.stats.Sacks['#text']))
                })
            }
            // sort LBs by Tackles
            if(this.searchedLBsArr.length > 1){
                this.searchedLBsArr.sort(function(a,b){
                return (Number(a.stats.TackleTotal['#text']) - Number(b.stats.TackleTotal['#text']))
                })
            }
            // sort CBs by Interceptions
            if(this.searchedCBsArr.length > 1){
                this.searchedCBsArr.sort(function(a,b){
                return (Number(a.stats.Interceptions['#text']) - Number(b.stats.Interceptions['#text']))
                })
            }
            // sort Ss by Interceptions
            if(this.searchedSsArr.length > 1){
                this.searchedSsArr.sort(function(a,b){
                return (Number(a.stats.Interceptions['#text']) - Number(b.stats.Interceptions['#text']))
                })
            }
            
        },
        addTextProps: function(){
            if(this.searchedQBsArr.length > 0){
                for(var i = 0; i < this.searchedQBsArr.length; i++){

                    var player1 = this.searchedQBsArr[i];

                    player1.mainText = `${player1.player.FirstName} ${player1.player.LastName}     Position: ${player1.player.Position}     Pass Yards: ${player1.stats.PassYards['#text']}     Team: ${player1.team.City} ${player1.team.Name}`

                    player1.collapseText = `Jersey Number: ${player1.player.JerseyNumber}`
                }
            }
        },

        // Prevent Default behavior
        preventDefault: function(){
            event.preventDefault();
        },

        // NFC WEST 

        // Selected Cardinals as a filter
        clickedCards: function(){
            if( this.azIsChecked === false){
                this.azIsChecked = true;
                this.teamsArr.push('ARI');
                document.getElementById("cardsBox").checked = true;
            } else if (this.azIsChecked === true){
                this.azIsChecked = false;
                var ind = this.teamsArr.indexOf('ARI');
                this.teamsArr.splice(ind,1);
                document.getElementById("cardsBox").checked = false;
            }
            console.log("AZ isChecked: ", mainVue.azIsChecked);
        },
        // Selected Seattle as a filter
        clickedSeattle: function(){
            if( this.seattleIsChecked === false){
                this.seattleIsChecked = true;
                this.teamsArr.push('SEA');
                document.getElementById("seattleBox").checked = true;
            } else if (this.seattleIsChecked === true){
                this.seattleIsChecked = false;
                var ind = this.teamsArr.indexOf('SEA');
                this.teamsArr.splice(ind,1);
                document.getElementById("seattleBox").checked = false;
            }
            console.log("Seattle isChecked: ", mainVue.seattleIsChecked);

        },
        // Selected 49ers as a filter
        clickedSanFran: function(){
            if( this.sanFranIsChecked === false){
                this.sanFranIsChecked = true;
                this.teamsArr.push('SF');
                document.getElementById("sanFranBox").checked = true;
            } else if (this.sanFranIsChecked === true){
                this.sanFranIsChecked = false;
                var ind = this.teamsArr.indexOf('SF');
                this.teamsArr.splice(ind,1);
                document.getElementById("sanFranBox").checked = false;
            }
            
            console.log("49ers isChecked: ", mainVue.sanFranIsChecked);
        },
        // Selected Rams as a filter
        clickedRams: function(){
            if( this.ramsIsChecked === false){
                this.ramsIsChecked = true;
                this.teamsArr.push('LA');
                document.getElementById("ramsBox").checked = true;

            } else {
                this.ramsIsChecked = false;
                var ind = this.teamsArr.indexOf('LA');
                this.teamsArr.splice(ind,1);
                document.getElementById("ramsBox").checked = false;
            }

            console.log("Rams isChecked: ", mainVue.ramsIsChecked);
        },

        // NFC East
        
        clickedEagles: function(){
            if( this.eaglesIsChecked === false){
                this.eaglesIsChecked = true;
                this.teamsArr.push('PHI');
                document.getElementById("eaglesBox").checked = true;
            } else if (this.eaglesIsChecked === true){
                this.eaglesIsChecked = false;
                var ind = this.teamsArr.indexOf('PHI');
                this.teamsArr.splice(ind,1);
                document.getElementById("eaglesBox").checked = false;
            }

            console.log("Eagles isChecked: ", mainVue.eaglesIsChecked);
        },

        clickedCowboys: function(){
            if( this.cowboysIsChecked === false){
                this.cowboysIsChecked = true;
                this.teamsArr.push('DAL');
                document.getElementById("cowboysBox").checked = true;
            } else if (this.cowboysIsChecked === true){
                this.cowboysIsChecked = false;
                var ind = this.teamsArr.indexOf('DAL');
                this.teamsArr.splice(ind,1);
                document.getElementById("cowboysBox").checked = false;
            }

            console.log("Cowboys isChecked: ", mainVue.cowboysIsChecked);
        },

        clickedRedskins: function(){
            if( this.redskinsIsChecked === false){
                this.redskinsIsChecked = true;
                this.teamsArr.push('WAS');
                document.getElementById("redskinsBox").checked = true;
            } else if (this.redskinsIsChecked === true){
                this.redskinsIsChecked = false;
                var ind = this.teamsArr.indexOf('WAS');
                this.teamsArr.splice(ind,1);
                document.getElementById("redskinsBox").checked = false;
            }

            console.log("Redskins isChecked: ", mainVue.redskinsIsChecked);
        },

        clickedGiants: function(){
            if( this.giantsIsChecked === false){
                this.giantsIsChecked = true;
                this.teamsArr.push('NYG');
                document.getElementById("giantsBox").checked = true;

            } else {
                this.giantsIsChecked = false;
                var ind = this.teamsArr.indexOf('NYG');
                this.teamsArr.splice(ind,1);
                document.getElementById("giantsBox").checked = false;
            }

            console.log("Giants isChecked: ", mainVue.giantsIsChecked);
        },

        // NFC South
        

        clickedSaints: function(){
            if( this.saintsIsChecked === false){
                this.saintsIsChecked = true;
                this.teamsArr.push('NO');
                document.getElementById("saintsBox").checked = true;
            } else if (this.saintsIsChecked === true){
                this.saintsIsChecked = false;
                var ind = this.teamsArr.indexOf('NO');
                this.teamsArr.splice(ind,1);
                document.getElementById("saintsBox").checked = false;
            }

            console.log("Saints isChecked: ", mainVue.saintsIsChecked);
        },

        clickedFalcons: function(){
            if( this.falconsIsChecked === false){
                this.falconsIsChecked = true;
                this.teamsArr.push('ATL');
                document.getElementById("falconsBox").checked = true;
            } else if (this.falconsIsChecked === true){
                this.falconsIsChecked = false;
                var ind = this.teamsArr.indexOf('ATL');
                this.teamsArr.splice(ind,1);
                document.getElementById("falconsBox").checked = false;
            }

            console.log("Falcons isChecked: ", mainVue.falconsIsChecked);
        },

        clickedBucs: function(){
            if( this.bucsIsChecked === false){
                this.bucsIsChecked = true;
                this.teamsArr.push('BUF');
                document.getElementById("bucsBox").checked = true;
            } else if (this.bucsIsChecked === true){
                this.bucsIsChecked = false;
                var ind = this.teamsArr.indexOf('BUF');
                this.teamsArr.splice(ind,1);
                document.getElementById("bucsBox").checked = false;
            }

            console.log("Bucs isChecked: ", mainVue.bucsIsChecked);
        },

        clickedPanthers: function(){
            if( this.panthersIsChecked === false){
                this.panthersIsChecked = true;
                this.teamsArr.push('CAR');
                document.getElementById("panthersBox").checked = true;

            } else {
                this.panthersIsChecked = false;
                var ind = this.teamsArr.indexOf('CAR');
                this.teamsArr.splice(ind,1);
                document.getElementById("panthersBox").checked = false;
            }

            console.log("Panthers isChecked: ", mainVue.panthersIsChecked);
        },

        // NFC North
        

        clickedPackers: function(){
            if( this.packersIsChecked === false){
                this.packersIsChecked = true;
                this.teamsArr.push('GB');
                document.getElementById("packersBox").checked = true;
            } else if (this.packersIsChecked === true){
                this.packersIsChecked = false;
                var ind = this.teamsArr.indexOf('GB');
                this.teamsArr.splice(ind,1);
                document.getElementById("packersBox").checked = false;
            }

            console.log("Packers isChecked: ", mainVue.packersIsChecked);
        },

        clickedVikings: function(){
            if( this.vikingsIsChecked === false){
                this.vikingsIsChecked = true;
                this.teamsArr.push('MIN');
                document.getElementById("vikingsBox").checked = true;
            } else if (this.vikingsIsChecked === true){
                this.vikingsIsChecked = false;
                var ind = this.teamsArr.indexOf('MIN');
                this.teamsArr.splice(ind,1);
                document.getElementById("vikingsBox").checked = false;
            }

            console.log("Vikings isChecked: ", mainVue.vikingsIsChecked);
        },

        clickedLions: function(){
            if( this.lionsIsChecked === false){
                this.lionsIsChecked = true;
                this.teamsArr.push('DET');
                document.getElementById("lionsBox").checked = true;
            } else if (this.lionsIsChecked === true){
                this.lionsIsChecked = false;
                var ind = this.teamsArr.indexOf('DET');
                this.teamsArr.splice(ind,1);
                document.getElementById("lionsBox").checked = false;
            }
 
            console.log("Lions isChecked: ", mainVue.lionsIsChecked);
        },

        clickedBears: function(){
            if( this.bearsIsChecked === false){
                this.bearsIsChecked = true;
                this.teamsArr.push('CHI');
                document.getElementById("bearsBox").checked = true;

            } else {
                this.bearsIsChecked = false;
                var ind = this.teamsArr.indexOf('CHI');
                this.teamsArr.splice(ind,1);
                document.getElementById("bearsBox").checked = false;
            }

            console.log("Bears isChecked: ", mainVue.bearsIsChecked);
        },

        // AFC WEST 
        

        clickedCheifs: function(){
            if( this.cheifsIsChecked === false){
                this.cheifsIsChecked = true;
                this.teamsArr.push('KC');
                document.getElementById("cheifsBox").checked = true;
            } else if (this.cheifsIsChecked === true){
                this.cheifsIsChecked = false;
                var ind = this.teamsArr.indexOf('KC');
                this.teamsArr.splice(ind,1);
                document.getElementById("cheifsBox").checked = false;
            }

            console.log("Cheifs isChecked: ", mainVue.cheifsIsChecked);
        },

        clickedBroncos: function(){
            if( this.broncosIsChecked === false){
                this.broncosIsChecked = true;
                this.teamsArr.push('DEN');
                document.getElementById("broncosBox").checked = true;
            } else if (this.broncosIsChecked === true){
                this.broncosIsChecked = false;
                var ind = this.teamsArr.indexOf('DEN');
                this.teamsArr.splice(ind,1);
                document.getElementById("broncosBox").checked = false;
            }

            console.log("Broncos isChecked: ", mainVue.broncosIsChecked);
        },

        clickedChargers: function(){
            if( this.chargersIsChecked === false){
                this.chargersIsChecked = true;
                this.teamsArr.push('LAC');
                document.getElementById("chargersBox").checked = true;
            } else if (this.chargersIsChecked === true){
                this.chargersIsChecked = false;
                var ind = this.teamsArr.indexOf('LAC');
                this.teamsArr.splice(ind,1);
                document.getElementById("chargersBox").checked = false;
            }

            console.log("Chargers isChecked: ", mainVue.chargersIsChecked);
        },

        clickedRaiders: function(){
            if( this.raidersIsChecked === false){
                this.raidersIsChecked = true;
                this.teamsArr.push('OAK');
                document.getElementById("raidersBox").checked = true;

            } else {
                this.raidersIsChecked = false;
                var ind = this.teamsArr.indexOf('OAK');
                this.teamsArr.splice(ind,1);
                document.getElementById("raidersBox").checked = false;
            }

            console.log("Raiders isChecked: ", mainVue.raidersIsChecked);
        },

        // AFC East
        

        clickedPats: function(){
            if( this.patsIsChecked === false){
                this.patsIsChecked = true;
                this.teamsArr.push('NE');
                document.getElementById("patsBox").checked = true;
            } else if (this.patsIsChecked === true){
                this.patsIsChecked = false;
                var ind = this.teamsArr.indexOf('NE');
                this.teamsArr.splice(ind,1);
                document.getElementById("patsBox").checked = false;
            }

            console.log("Pats isChecked: ", mainVue.patsIsChecked);
        },

        clickedDolphins: function(){
            if( this.dolphinsIsChecked === false){
                this.dolphinsIsChecked = true;
                this.teamsArr.push('MIA');
                document.getElementById("dolphinsBox").checked = true;
            } else if (this.dolphinsIsChecked === true){
                this.dolphinsIsChecked = false;
                var ind = this.teamsArr.indexOf('MIA');
                this.teamsArr.splice(ind,1);
                document.getElementById("dolphinsBox").checked = false;
            }

            console.log("Dolphins isChecked: ", mainVue.dolphinsIsChecked);
        },

        clickedBills: function(){
            if( this.billsIsChecked === false){
                this.billsIsChecked = true;
                this.teamsArr.push('BUF');
                document.getElementById("billsBox").checked = true;
            } else if (this.billsIsChecked === true){
                this.billsIsChecked = false;
                var ind = this.teamsArr.indexOf('BUF');
                this.teamsArr.splice(ind,1);
                document.getElementById("billsBox").checked = false;
            }

            console.log("Bills isChecked: ", mainVue.billsIsChecked);
        },

        clickedJets: function(){
            if( this.jetsIsChecked === false){
                this.jetsIsChecked = true;
                this.teamsArr.push('NYJ');
                document.getElementById("jetsBox").checked = true;

            } else {
                this.jetsIsChecked = false;
                var ind = this.teamsArr.indexOf('NYJ');
                this.teamsArr.splice(ind,1);
                document.getElementById("jetsBox").checked = false;
            }

            console.log("Jets isChecked: ", mainVue.jetsIsChecked);
        },

        // AFC South
        
        clickedJags: function(){
            if( this.jagsIsChecked === false){
                this.jagsIsChecked = true;
                this.teamsArr.push('JAX');
                document.getElementById("jagsBox").checked = true;
            } else if (this.jagsIsChecked === true){
                this.jagsIsChecked = false;
                var ind = this.teamsArr.indexOf('JAX');
                this.teamsArr.splice(ind,1);
                document.getElementById("jagsBox").checked = false;
            }

            console.log("Jags isChecked: ", mainVue.jagsIsChecked);
        },

        clickedTitans: function(){
            if( this.titansIsChecked === false){
                this.titansIsChecked = true;
                this.teamsArr.push('TEN');
                document.getElementById("titansBox").checked = true;
            } else if (this.titansIsChecked === true){
                this.titansIsChecked = false;
                var ind = this.teamsArr.indexOf('TEN');
                this.teamsArr.splice(ind,1);
                document.getElementById("titansBox").checked = false;
            }

            console.log("Titans isChecked: ", mainVue.titansIsChecked);
        },

        clickedColts: function(){
            if( this.coltsIsChecked === false){
                this.coltsIsChecked = true;
                this.teamsArr.push('IND');
                document.getElementById("coltsBox").checked = true;
            } else if (this.coltsIsChecked === true){
                this.coltsIsChecked = false;
                var ind = this.teamsArr.indexOf('IND');
                this.teamsArr.splice(ind,1);
                document.getElementById("coltsBox").checked = false;
            }

            console.log("Colts isChecked: ", mainVue.coltsIsChecked);
        },

        clickedTexans: function(){
            if( this.texansIsChecked === false){
                this.texansIsChecked = true;
                this.teamsArr.push('HOU');
                document.getElementById("texansBox").checked = true;

            } else {
                this.texansIsChecked = false;
                var ind = this.teamsArr.indexOf('HOU');
                this.teamsArr.splice(ind,1);
                document.getElementById("texansBox").checked = false;
            }

            console.log("Texans isChecked: ", mainVue.texansIsChecked);
        },

        // AFC North
        
        clickedSteelers: function(){
            if( this.steelersIsChecked === false){
                this.steelersIsChecked = true;
                this.teamsArr.push('PIT');
                document.getElementById("steelersBox").checked = true;
            } else if (this.steelersIsChecked === true){
                this.steelersIsChecked = false;
                var ind = this.teamsArr.indexOf('PIT');
                this.teamsArr.splice(ind,1);
                document.getElementById("steelersBox").checked = false;
            }

            console.log("Steelers isChecked: ", mainVue.steelersIsChecked);
        },

        clickedRavens: function(){
            if( this.ravensIsChecked === false){
                this.ravensIsChecked = true;
                this.teamsArr.push('BAL');
                document.getElementById("ravensBox").checked = true;
            } else if (this.ravensIsChecked === true){
                this.ravensIsChecked = false;
                var ind = this.teamsArr.indexOf('BAL');
                this.teamsArr.splice(ind,1);
                document.getElementById("ravensBox").checked = false;
            }

            console.log("Ravens isChecked: ", mainVue.ravensIsChecked);
        },

        clickedBengals: function(){
            if( this.bengalsIsChecked === false){
                this.bengalsIsChecked = true;
                this.teamsArr.push('CIN');
                document.getElementById("bengalsBox").checked = true;
            } else if (this.bengalsIsChecked === true){
                this.bengalsIsChecked = false;
                var ind = this.teamsArr.indexOf('CIN');
                this.teamsArr.splice(ind,1);
                document.getElementById("bengalsBox").checked = false;
            }

            console.log("Bengals isChecked: ", mainVue.bengalsIsChecked);
        },

        clickedBrowns: function(){
            if( this.brownsIsChecked === false){
                this.brownsIsChecked = true;
                this.teamsArr.push('CLE');
                document.getElementById("brownsBox").checked = true;

            } else {
                this.brownsIsChecked = false;
                var ind = this.teamsArr.indexOf('CLE');
                this.teamsArr.splice(ind,1);
                document.getElementById("brownsBox").checked = false;
            }

            console.log("Browns isChecked: ", mainVue.brownsIsChecked);
        },



        // Clicking Offensive Positions

        clickedQB: function(){
            if( this.qbIsChecked === false){
                this.qbIsChecked = true;
                this.positionsArr.push('qb');
                document.getElementById("qbBox").checked = true;

            } else {
                this.qbIsChecked = false;
                var ind = this.positionsArr.indexOf('qb');
                this.positionsArr.splice(ind,1);
                document.getElementById("qbBox").checked = false;
            }
            console.log("QB isChecked: ", mainVue.qbIsChecked);
        },

        clickedRB: function(){
            if( this.rbIsChecked === false){
                this.rbIsChecked = true;
                this.positionsArr.push('rb');
                this.positionsArr.push('fb');
                document.getElementById("rbBox").checked = true;

            } else {
                this.rbIsChecked = false;
                var ind = this.positionsArr.indexOf('rb');
                this.positionsArr.splice(ind,1);
                var ind1 = this.positionsArr.indexOf('fb');
                this.positionsArr.splice(ind1,1);
                document.getElementById("rbBox").checked = false;
            }
            console.log("RB isChecked: ", mainVue.rbIsChecked);
        },

        clickedWR: function(){
            if( this.wrIsChecked === false){
                this.wrIsChecked = true;
                this.positionsArr.push('wr');
                document.getElementById("wrBox").checked = true;

            } else {
                this.wrIsChecked = false;
                var ind = this.positionsArr.indexOf('wr');
                this.positionsArr.splice(ind,1);
                document.getElementById("wrBox").checked = false;
            }
            console.log("WR isChecked: ", mainVue.wrIsChecked);
        },

        clickedTE: function(){
            if( this.teIsChecked === false){
                this.teIsChecked = true;
                this.positionsArr.push('te');
                document.getElementById("teBox").checked = true;

            } else {
                this.teIsChecked = false;
                var ind = this.positionsArr.indexOf('te');
                this.positionsArr.splice(ind,1);
                document.getElementById("teBox").checked = false;
            }
            console.log("TE isChecked: ", mainVue.teIsChecked);
        },

        clickedK: function(){
            if( this.kIsChecked === false){
                this.kIsChecked = true;
                this.positionsArr.push('k');
                document.getElementById("kBox").checked = true;

            } else {
                this.kIsChecked = false;
                var ind = this.positionsArr.indexOf('k');
                this.positionsArr.splice(ind,1);
                document.getElementById("kBox").checked = false;
            }
            console.log("K isChecked: ", mainVue.kIsChecked);
        },

        clickedP: function(){
            if( this.pIsChecked === false){
                this.pIsChecked = true;
                this.positionsArr.push('p');
                document.getElementById("pBox").checked = true;

            } else {
                this.pIsChecked = false;
                var ind = this.positionsArr.indexOf('p');
                this.positionsArr.splice(ind,1);
                document.getElementById("pBox").checked = false;
            }
            console.log("P isChecked: ", mainVue.pIsChecked);
        },

        clickedC: function(){
            if( this.cIsChecked === false){
                this.cIsChecked = true;
                this.positionsArr.push('c');
                document.getElementById("cBox").checked = true;

            } else {
                this.cIsChecked = false;
                var ind = this.positionsArr.indexOf('c');
                this.positionsArr.splice(ind,1);
                document.getElementById("cBox").checked = false;
            }
            console.log("C isChecked: ", mainVue.cIsChecked);
        },

        clickedT: function(){
            if( this.tIsChecked === false){
                this.tIsChecked = true;
                this.positionsArr.push('t');
                this.positionsArr.push('ot');
                document.getElementById("tBox").checked = true;

            } else {
                this.tIsChecked = false;
                var ind = this.positionsArr.indexOf('t');
                this.positionsArr.splice(ind,1);
                var ind1 = this.positionsArr.indexOf('ot');
                this.positionsArr.splice(ind1,1);
                document.getElementById("tBox").checked = false;
            }
            console.log("T isChecked: ", mainVue.tIsChecked);
        },

        clickedG: function(){
            if( this.gIsChecked === false){
                this.gIsChecked = true;
                this.positionsArr.push('g');
                document.getElementById("gBox").checked = true;

            } else {
                this.gIsChecked = false;
                var ind = this.positionsArr.indexOf('g');
                this.positionsArr.splice(ind,1);
                document.getElementById("gBox").checked = false;
            }
            console.log("G isChecked: ", mainVue.gIsChecked);
        },

        // Clicking Defensive Positions

        clickedDT: function(){
            if( this.dtIsChecked === false){
                this.dtIsChecked = true;
                this.positionsArr.push('dt');
                this.positionsArr.push('nt');
                document.getElementById("dtBox").checked = true;

            } else {
                this.dtIsChecked = false;
                var ind = this.positionsArr.indexOf('dt');
                this.positionsArr.splice(ind,1);
                var ind1 = this.positionsArr.indexOf('nt');
                this.positionsArr.splice(ind1,1);
                document.getElementById("dtBox").checked = false;
            }
            console.log("DT isChecked: ", mainVue.dtIsChecked);
        },

        clickedDE: function(){
            if( this.deIsChecked === false){
                this.deIsChecked = true;
                this.positionsArr.push('de');
                document.getElementById("deBox").checked = true;

            } else {
                this.deIsChecked = false;
                var ind = this.positionsArr.indexOf('de');
                this.positionsArr.splice(ind,1);
                document.getElementById("deBox").checked = false;
            }
            console.log("DE isChecked: ", mainVue.deIsChecked);
        },

        clickedLB: function(){
            if( this.lbIsChecked === false){
                this.lbIsChecked = true;
                this.positionsArr.push('lb');
                this.positionsArr.push('olb');
                this.positionsArr.push('mlb');
                this.positionsArr.push('ilb');
                document.getElementById("lbBox").checked = true;

            } else {
                this.lbIsChecked = false;
                var ind1 = this.positionsArr.indexOf('lb');
                this.positionsArr.splice(ind1,1);
                var ind2 = this.positionsArr.indexOf('olb');
                this.positionsArr.splice(ind2,1);
                var ind3 = this.positionsArr.indexOf('mlb');
                this.positionsArr.splice(ind3,1);
                var ind4 = this.positionsArr.indexOf('ilb');
                this.positionsArr.splice(ind4,1);
                document.getElementById("lbBox").checked = false;
            }
            console.log("LB isChecked: ", mainVue.lbIsChecked);
        },
        clickedls: function() {
            if( this.lsIsChecked === false){
                this.lsIsChecked = true;
                this.positionsArr.push('ls');
                document.getElementById("lsBox").checked = true;

            } else {
                this.lsIsChecked = false;
                var ind = this.positionsArr.indexOf('ls');
                this.positionsArr.splice(ind,1);
                document.getElementById("lsBox").checked = false;
            }
            console.log("LS isChecked: ", mainVue.lsIsChecked);
        },

        clickedCB: function(){
            if( this.cbIsChecked === false){
                this.cbIsChecked = true;
                this.positionsArr.push('cb');
                this.positionsArr.push('db');
                document.getElementById("cbBox").checked = true;

            } else {
                this.cbIsChecked = false;
                var ind = this.positionsArr.indexOf('cb');
                this.positionsArr.splice(ind,1);
                var ind1 = this.positionsArr.indexOf('db');
                this.positionsArr.splice(ind1,1);
                document.getElementById("cbBox").checked = false;
            }
            console.log("CB isChecked: ", mainVue.cbIsChecked);
        },

        clickedS: function(){
            if( this.sIsChecked === false){
                this.sIsChecked = true;
                this.positionsArr.push('fs');
                this.positionsArr.push('ss');
                document.getElementById("sBox").checked = true;

            } else {
                this.sIsChecked = false;
                var ind = this.positionsArr.indexOf('fs');
                this.positionsArr.splice(ind,1);
                var ind1 = this.positionsArr.indexOf('ss');
                this.positionsArr.splice(ind1,1);
                document.getElementById("sBox").checked = false;
            }
            console.log("S isChecked: ", mainVue.sIsChecked);
        }
    }

})
    

