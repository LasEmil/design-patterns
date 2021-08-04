import fs from "fs";
import path from "path";
export const Iterator = (): void => {
  class Profile {
    id: string;
    email: string;
    friends: Array<Record<string, unknown>>;
    constructor(
      id: string,
      email: string,
      friends?: Array<Record<string, unknown>>
    ) {
      this.id = id;
      this.email = email;
      this.friends = friends;
    }
    getId() {
      return this.id;
    }
    getEmail() {
      return this.email;
    }
  }
  interface ProfileIterator {
    getNext: () => Profile;
    hasMore(): boolean;
  }
  interface SocialNetwork {
    createFriendsIterator(profileId: string): ProfileIterator;
    createCoworkersIterator(profileID: string): ProfileIterator;
  }

  enum FriendType {
    friends = "friend",
    coworkers = "coworkers",
  }
  class Facebook implements SocialNetwork {
    users: Profile[];
    constructor() {
      this.users = [];
      this.init();
    }
    init() {
      try {
        const data = fs.readFileSync(path.join(__dirname, "facebook.json"), {
          encoding: "utf-8",
        });
        const parsedFriends = JSON.parse(data);

        parsedFriends.users.forEach((user) => {
          this.users.push(
            new Profile(
              user.id,
              `facebook-user-${user.id}@facebook.com`,
              user.friends
            )
          );
        });
      } catch (err) {
        console.log(err);
      }
    }
    createFriendsIterator(profileID: string) {
      return new FacebookIterator(this, profileID, FriendType.friends);
    }
    createCoworkersIterator(profileID: string) {
      return new FacebookIterator(this, profileID, FriendType.coworkers);
    }

    socialGraphRequest(profileID: string, type: FriendType) {
      console.log({ profileID, type });
      const userFriends = this.users
        .find((user: Profile) => user.getId() === profileID)
        .friends.filter((friend) => friend.type === type);
      const userFriendProfiles = userFriends.map(
        (user) =>
          new Profile(
            user.id as string,
            `friend-of-${profileID}-id:${user.id}-user@facebook.com`
          )
      );
      return userFriendProfiles;
    }
  }

  class FacebookIterator implements ProfileIterator {
    private facebook: Facebook;
    private profileId: string;
    private currentPosition: number;
    private cache: Profile[];
    private type: FriendType;

    constructor(facebook: Facebook, profileId: string, type: FriendType) {
      this.facebook = facebook;
      this.profileId = profileId;
      this.type = type;
      this.cache = [];
      this.currentPosition = 0;
    }
    private lazyInit() {
      if (this.cache.length === 0) {
        const sg = this.facebook.socialGraphRequest(this.profileId, this.type);
        this.cache = sg;
      }
    }
    getNext() {
      if (this.hasMore()) {
        const currentProfile = this.cache[this.currentPosition];
        this.currentPosition++;
        return currentProfile;
      }
    }
    hasMore() {
      this.lazyInit();
      return this.currentPosition < this.cache.length;
    }
  }
  class SocialSpammer {
    send(iterator: ProfileIterator, message: string) {
      while (iterator.hasMore()) {
        const profile = iterator.getNext();
        console.log(`Sending email to ${profile.getEmail()}: ${message}`);
      }
    }
  }

  class Application {
    network: SocialNetwork;
    spammer: SocialSpammer;
    config() {
      this.network = new Facebook();
      this.spammer = new SocialSpammer();
    }
    sendSpamToFriends(profile: Profile) {
      const iterator = this.network.createFriendsIterator(profile.getId());
      this.spammer.send(iterator, "Very important message");
    }
    sendSpamToCoworkers(profile: Profile) {
      const iterator = this.network.createCoworkersIterator(profile.getId());
      this.spammer.send(iterator, "Very important message to coworkers");
    }
  }
  const app = new Application();
  app.config();
  const target = new Profile("1", "facebook-user-1@facebook.com");
  app.sendSpamToFriends(target);
};
