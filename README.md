# Backend final test

This app will let you manage a blog that has users that can be authors or readers, the authors can publish entries for the blog and all the users can subscribe to an author to receive a notification when the author posts a blog entry.

To install it you have follow the listed steps:

1. Download the release.
2. Extract the compressed file wherever you want.
3. Open the terminal on the folder that where you extracted the contents of the release.
4. Type `npm install` on the terminal.
5. Type `npm start` on the terminal.

<DOCUMENTATION>

You can create a user with the mutation "addUser", it requires the email, the password, and the type of user that is going to be:
	-User_type = 0: Reader.
	-User_type = 1: Author.

You must be logged in in order to perform the following actions:
	-Read any kind of entry.
	-Logout.
	-Subscribe to an author.
	-Publish/delete an entry (only if you are an author).

Each login token lasts for 1800000ms, or 30min (1800s), this means that every user will have to login again every 30min. This process does not work if the server is restarted, as the promise will be lost.

Every user is compossed by:
	-Email: The email that the user used to register.
	-Password: The password that the user setted on the registration process.
	-User_type: Type of the user (0 for reader, 1 for author).
	-Entries: The entries made by the user.
	-Token: Token of the current session.

Every entry is compossed by:
	-Title: The title of the entry.
	-Description: The content of the entry.
	-User: The author of the entry.

# DO NOT BOTHER USING THE USERNAME AND PASSWORD FOR THAT CLUSTER, IT WON'T WORK
