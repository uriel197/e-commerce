const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must enter a name"],
    minlength: 3,
    maxlength: 50,
  },

  email: {
    type: String,
    required: [true, "Please provide email"] /* 1 */,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // Skip if password is not modified
  /* 2 */
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);

/*************** COMMENTS **************

***1: ^: Asserts the start of the line.
(...): Groups multiple patterns together.
([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*): This part checks for the local part of the email address (before the @ symbol). 
[^<>()[\]\\.,;:\s@"] : 
the allowed characters in the first portion of the email address are any characters except the ones listed in the set [<>()\[\]\\.,;:\s@"]
(\.[^<>()[\]\\.,;:\s@"]+)*: This part allows for a dot followed by more characters that are not within the set [<>()\[\]\\.,;:\s@"], dots are allowed in the first part of the email address before the "@" symbol, both in unquoted and quoted strings.
|: Acts as an OR operator.
(".+"): This part checks for a quoted string as the local part of the email address. The regular expression allows for two main formats in the local part of the email address: quoted strings and Unquoted strings.
@: Matches the @ symbol.
(...): Groups multiple patterns together.
(\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\]): This part checks for an IP address within square brackets.
|: Acts as an OR operator.
(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}): This part checks for the domain part of the email address. It allows for alphanumeric characters and hyphens, followed by a dot, and then at least two letters for the top-level domain. TLD, short for top-level domain, is the last segment of a domain name – the part that comes after the final dot. The most common example is .com
$: Asserts the end of the line.

***2: we write the word "function" after the async word in order to have access to the "this" keyword which refers to the user. arrow functions dont allowed the "this" keyword.

*/
