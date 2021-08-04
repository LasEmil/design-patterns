export const State = (): void => {
  abstract class AudioPlayerState {
    protected player: AudioPlayer;

    constructor(player: AudioPlayer) {
      this.player = player;
    }

    abstract clickLock(): void;
    abstract clickPlay(): void;
    abstract clickNext(): void;
    abstract clickPrevious(): void;
  }
  interface Button {
    onClick: (fn: () => void) => void;
  }
  class LockButton implements Button {
    onClick(fn: () => void) {
      // fn();
    }
  }
  class PlayButton implements Button {
    onClick(fn: () => void) {
      // fn();
    }
  }
  class NextButton implements Button {
    onClick(fn: () => void) {
      // fn();
    }
  }
  class PrevButton implements Button {
    onClick(fn: () => void) {
      // fn();
    }
  }

  class UserInterface {
    lockButton: Button;
    playButton: Button;
    nextButton: Button;
    prevButton: Button;

    constructor() {
      this.lockButton = new LockButton();
      this.playButton = new PlayButton();
      this.nextButton = new NextButton();
      this.prevButton = new PrevButton();
    }
  }
  class AudioPlayer {
    state: AudioPlayerState;
    UI: UserInterface;
    voulme: number;
    playlist: Array<string>;
    currentSong: string;
    playing: boolean;

    constructor() {
      this.state = new ReadyState(this);
      this.UI = new UserInterface();
      this.UI.lockButton.onClick(this.clickLock);
      this.UI.playButton.onClick(this.clickPlay);
      this.UI.nextButton.onClick(this.clickNext);
      this.UI.prevButton.onClick(this.clickPrevious);
    }
    setState(state: AudioPlayerState) {
      this.state = state;
    }

    public clickLock = () => {
      console.log(this);
      this.state.clickLock();
    };
    public clickPlay = () => {
      this.state.clickPlay();
    };
    public clickNext = () => {
      this.state.clickNext();
    };
    public clickPrevious = () => {
      this.state.clickPrevious();
    };

    startPlayback() {
      console.log("starting playback");
      this.playing = true;
    }
    stopPlayback() {
      console.log("stopping playback");
      this.playing = false;
    }
    nextSong() {
      console.log("playing next song");
    }
    previousSong() {
      console.log("playing previous song");
    }
  }

  class LockedState extends AudioPlayerState {
    clickLock() {
      if (this.player.playing) {
        this.player.setState(new PlayingState(this.player));
      } else {
        this.player.setState(new ReadyState(this.player));
      }
    }
    clickPlay() {
      console.log("play does nothing");
    }
    clickNext() {
      console.log("next does nothing");
    }
    clickPrevious() {
      console.log("prev does nothing");
    }
  }

  class ReadyState extends AudioPlayerState {
    clickLock() {
      this.player.setState(new LockedState(this.player));
    }
    clickPlay() {
      this.player.startPlayback();
      this.player.setState(new PlayingState(this.player));
    }
    clickNext() {
      this.player.nextSong();
      this.player.setState(new PlayingState(this.player));
    }
    clickPrevious() {
      this.player.previousSong();
      this.player.setState(new PlayingState(this.player));
    }
  }

  class PlayingState extends AudioPlayerState {
    clickLock() {
      this.player.setState(new LockedState(this.player));
    }
    clickPlay() {
      this.player.stopPlayback();
      this.player.setState(new ReadyState(this.player));
    }
    clickNext() {
      this.player.nextSong();
    }
    clickPrevious() {
      this.player.previousSong();
    }
  }

  const player = new AudioPlayer();
  player.clickPlay();
  player.clickPlay();
  player.clickNext();
  player.clickPlay();
};
