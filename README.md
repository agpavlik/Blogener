# Blogener

The AI-powered SAAS solution to generate SEO-optimized blog posts in minutes. Get high-quality content, without sacrificing your time.

This app was deployed:

Try it for free with credentials:

## Features of App

- A new user visiting the start page is directed to the signup/login page. The registration process has been implemented based on `Auth0`.
- The application features a consistent dashboard comprising the following elements:
  - Button to generate a new post
  - Token balance display
  - List of generated posts
  - Current user information
  - Logout option
- To create a new post, users must input a topic and several relevant keywords. Posts will be generated using `OpenAI`.
- Generated posts are divided into three sections: SEO title and meta description, Keywords, and the actual blog post.
- Users can browse through the list of posts, read them, and delete them as desired.
- Tokens are utilized to generate new posts. Users can replenish their token balance using the functionality provided by `Stripe`.

## Tech Stack

- NEXT JS
- Tailwind CSS
- MongoDB
- OpenAI
- Auth0
- Stripe
- FontAwesome

### Demovideo

![Demovideo](./public/docs/demo67.gif)

### Pages

##### Start Page

![](./public/docs/demo1.png)

##### Generate new post

![](./public/docs/demo2.png)

##### Explore generated blog

![](./public/docs/demo3.png)

##### Delete post

![](./public/docs/demo4.png)

##### Add tokens page

![](./public/docs/demo5.png)

##### Stripe Payment

![](./public/docs/demo6.png)

## Setup

Install dependencies and run app

```sh
npm install
npm run dev
```
