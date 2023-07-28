import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { DBullet, DGameControls, DGameDifficulty, DGameLevel, DGameLife, DGameScore, DGameSprintSpeed, DMousePointer, DPlayer, DUfo } from 'src/app/core/constants/defaults';
import { ROUTES } from 'src/app/core/constants/urlconstants';
import { CommonHelpers } from 'src/app/core/helpers/common.helper';
import { Bullet } from 'src/app/core/models/bullet';
import { IncomingMessage } from 'src/app/core/models/incoming-message';
import { AnnounceAction } from 'src/app/core/models/announce-action';
import { IGameControls, IMousePointer } from 'src/app/core/models/models';
import { Player } from 'src/app/core/models/player';
import { Ufo } from 'src/app/core/models/ufo';
import { ScoresService } from 'src/app/core/services/scores/scores.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  private canvas: ElementRef<HTMLCanvasElement> | undefined;
  private context: CanvasRenderingContext2D | undefined | null;

  @Input() gameMode: boolean;

  @Output() startRadioCall = new EventEmitter();
  @Output() endRadioCall = new EventEmitter();
  @Output() announceCall = new EventEmitter<string>();

  top = environment.top;
  left = environment.left;
  width = environment.width;
  height = environment.height;

  private player: Player | undefined;
  private ufoList: Ufo[]  = [];
  private messageList: IncomingMessage[]  = [];
  private announceAction: AnnounceAction[] = [];
  private bulletList: Bullet[] = [];

  private canvasCounter: number | undefined;

  private difficulty: number;
  private sprintSpeed: number;
  private controls: IGameControls;
  private mousePosition: IMousePointer;

  score: number;
  life: number;
  level: number;

  isDead= true;
  private isDestroyed: boolean;
  private isClicked: boolean;
  private isMobile: boolean;

  constructor(private scoresService: ScoresService) {
    this.difficulty = DGameDifficulty;
    this.sprintSpeed = DGameSprintSpeed;
    this.controls = DGameControls;
    this.mousePosition = DMousePointer;
    this.score = DGameScore;
    this.life = DGameLife;
    this.level = DGameLevel;
    this.isDestroyed = false;
    this.isClicked = false;
    this.isMobile = CommonHelpers.isMobileDevice();
  }

  ngOnInit(): void {
    this.canvas!.nativeElement.height = this.height;
    this.canvas!.nativeElement.width = this.width;
    this.context = this.canvas!.nativeElement.getContext('2d');

    this.canvasCounter = 1;

    this.startNewGame();

    if (this.scoresService.getScores().length === 0) {
      this.scoresService.getHighScores().pipe(take(1)).subscribe();
    }
  }

  /**
   * Start a new Game
   */
  startNewGame(): void {
    this.initDifficulty();
    this.startNewLife();
    this.life = 3;
    this.isDead = false;
    this.animate();
  }

  /**
   * Start a new life.
   * Called when starting new game or Player get hit by UFO
   */
  startNewLife(): void {
    this.player = new Player(
      DPlayer.height,
      DPlayer.width,
      this.width / 2 - 15,
      this.height - 70,
      this.difficulty
    );
    this.bulletList = [];
    this.ufoList = [];
  }

  /**
   * Create and add new UFO into the Canvas
   */
  newUfo(): void {
    this.ufoList.push(
      new Ufo(DUfo.height, DUfo.width, this.difficulty * this.level, this.difficulty)
    );
  }

  newMessage(): void {
    this.messageList.push(
      new IncomingMessage("Hello World", DUfo.height, DUfo.width, this.difficulty * this.level, this.difficulty)
    );
  }

  newAnnounceActions(): void {
    let message = '';
    switch(this.getRandomInt(8))
    {
      case 0: message = 'Radio Test'; break;
      case 1: message = 'Begin Taxi'; break;
      case 2: message = 'Departing'; break;
      case 3: message = 'Leaving Traffic Pattern'; break;
      case 4: message = 'Turning Cross Wind'; break;
      case 5: message = 'Turning Down Wind'; break;
      case 6: message = 'Turning Base Leg'; break;
      case 7: message = 'Turning Final'; break;
    }

    this.announceAction.push(
      new AnnounceAction(message, DUfo.height, DUfo.width, this.difficulty * this.level, this.difficulty)
    )

    this.announceCall.emit(message);
  }

  getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }


  /**
   * Create and add new Bullet into the screen based on Player position
   */
  newBullet(): void {
    this.bulletList.push(
      new Bullet(DBullet.height, DBullet.width, this.player!.x + 14, this.player!.y, this.difficulty * 4)
    );
  }

  /**
   * Reset list of bullets, UFOs, update life.
   * When life becomes 0,
   *   If score gets into leaderboard, navigate to SaveScores page.
   *   Else navigate to Highscores page
   */
  dead(): void {
    this.bulletList = [];
    this.ufoList = [];
    this.messageList = [];
    this.life--;

    if (this.life >= 1) {
      this.startNewLife();
      return;
    }

    this.context.fillStyle = '#FF0000';
    this.context.fillText("GAME OVER", (environment.width / 2) - 50, 100);
    this.isDead= true;
  }

  /**
   * Initialize difficulty of the game from User input
   */
  initDifficulty() {
    const difficultyList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    //const selectedDifficulty = prompt('Enter difficulty (1-10): ', '2');
    const selectedDifficulty = '2';
    if (difficultyList.includes(selectedDifficulty!)) {
      this.difficulty = parseInt(selectedDifficulty!, 10);
    } else {
      this.difficulty = 2;
    }
  }

  /**
   * Clear the HTML Canvas
   */
  clear(): void {
    this.context!.clearRect(
      0,
      0,
      this.width,
      this.height
    );
  }

  /**
   * Animate method that Renders the HTML Canvas contents
   */
  animate() {
    this.clear();
    this.canvasCounter++;

    // Check if there's a level update
    if (Math.floor(this.score / 100) > this.level) {
      this.level++;
      document.getElementById('level-banner')!.style.opacity = '1';
      setTimeout(() => {
        document.getElementById('level-banner')!.style.opacity = '0';
      }, 1500);
    }

    // Shoot new Bullet when Mouse is used
    if (this.isClicked && this.isMobile && this.canvasCounter! % 30 === 0) {
      if (this.bulletList.length < 5) {
        this.newBullet();
      }
      this.controls.shoot = true;
    }

    // Update the player
    if (this.isClicked) {
      const maxSpeed = this.player!.speed * this.sprintSpeed;
      //this.player.dx = (this.mousePosition.x - (this.player.x + DPlayer.width / 2)) ;
      //this.player.dy = (this.mousePosition.y - (this.player.y + DPlayer.height / 2));



      this.player.x = (this.mousePosition.x)// + environment.top;
      this.player.y = (this.mousePosition.y)// + environment.left;
    }

    this.player.draw(this.context);

    // Update each UFO
    this.ufoList.forEach((ufo, i) => {
      // Check if the UFO is hit by the Player
      if (
        CommonHelpers.isCollided(
          ufo.y,
          ufo.y + ufo.height,
          ufo.x,
          ufo.x + ufo.width,
          this.player.y,
          this.player.y + this.player.height,
          this.player.x,
          this.player.x + this.player.width
        )
      ) {
        this.dead();
      } else if (ufo.y < window.innerHeight - 40) {
        ufo.update(this.context);
      } else {
        this.ufoList.splice(i, 1);
      }
    });

    this.messageList.forEach((msg, i)=> {
      if (msg.y < window.innerHeight - 40) {
        msg.update(this.context);
      }else {
        this.messageList.splice(i, 1);
      }
    })

    this.announceAction.forEach((msg, i)=> {
      if (msg.y < window.innerHeight - 40) {
        msg.update(this.context);
      }else {
        this.announceAction.splice(i, 1);
      }
    })

    // Check if the Bullet hits any of the UFOs
    this.bulletList.forEach((bullet, i) => {
      this.ufoList.forEach((ufo, j) => {
        if (
          CommonHelpers.isCollided(
            ufo.y,
            ufo.y + ufo.height,
            ufo.x,
            ufo.x + ufo.width,
            bullet.y,
            bullet.y + bullet.height,
            bullet.x,
            bullet.x + bullet.width
          )
        ) {
          this.controls.shoot = false;
          this.score += this.difficulty;
          this.bulletList.splice(i, 1);
          this.ufoList.splice(j, 1);
        }
      });

      // Update the bullet if bullet is still in the screen
      if (0 < bullet.y + bullet.height) {
        bullet.update(this.context);
      } else {
        this.bulletList.splice(i, 1);
      }
    });

    // Launch new UFOs into the screen periodically
    if (this.canvasCounter % (100 / this.difficulty) === 0) {
      this.newUfo();
    }

    if (this.canvasCounter % (100 / (this.difficulty / 5)) === 0 && this.messageList.length == 0) {
      this.newMessage();
    }

    if (this.canvasCounter % (100 / (this.difficulty / 5)) === 0 && this.announceAction.length == 0) {
      this.newAnnounceActions();
    }


    // Stop rendering when component is destroyed
    if (!this.isDestroyed && !this.isDead) {
      requestAnimationFrame(this.animate.bind(this));
    }
  }

  @HostListener('document:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    if (this.isClicked) {
      return;
    }
    if(event.key === 'r') {
      this.startRadioCall.emit();
    } else if (event.key === ' ' || event.key === 'Enter') {
      if (!this.controls.shoot && this.bulletList.length < 5) {
        this.newBullet();
      }
      this.controls.shoot = true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    if(event.key === 'r') {
      console.log('ending radio call.');
      this.endRadioCall.emit();
    } else if (event.key === ' ' || event.key === 'Enter') {
      this.controls.shoot = false;
    }
  }

  @HostListener('document:mousedown', ['$event'])
  mouseDown(event: MouseEvent) { this.dragStart(event.clientX, event.clientY); }
  @HostListener('document:mouseup', ['$event'])
  mouseUp(event: MouseEvent) { this.dragStop(); }


  @HostListener('document:touchstart', ['$event'])
  touchStart(event: TouchEvent) { this.dragStart(event.touches[0].clientX, event.touches[0].clientY); }
  @HostListener('document:touchend', ['$event'])
  touchEnd(event: TouchEvent) { this.dragStop();  }
  @HostListener('document:touchcancel', ['$event'])
  touchCancel(event: TouchEvent) { this.dragStop(); }
  @HostListener('document:touchmove', ['$event'])
  touchMove(event: TouchEvent) { this.setMousePosition(event.touches[0].clientX, event.touches[0].clientY); }

  dragStart(clientX: number, clientY: number): void {
    this.isClicked = true;
    this.controls.left = false;
    this.controls.up = false;
    this.controls.right = false;
    this.controls.down = false;
    let x = clientX - this.left;
    let y = clientY - this.top;

    this.setMousePosition(x, y);
  }

  dragStop(): void {
    this.isClicked = false;
    this.controls.shoot = false;
  }

  setMousePosition(clientX: number, clientY: number): void {
    if (this.isClicked) {
      this.mousePosition.x = clientX;
      this.mousePosition.y = clientY;
      console.log(this.mousePosition);
    }
  }

  @HostListener('window:orientationchange', ['$event'])
  deviceOrientation(event: DeviceOrientationEvent) {
    if (window.innerHeight < window.innerWidth) {
      alert('device orientation changed. Restarting the game...');
      location.reload();
    }
  }


  restartGame() {
    this.startNewGame();
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
  }
}
