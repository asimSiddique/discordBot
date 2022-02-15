// Require dependencies
const { Client, Intents } = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios'); 

// Load environment variables
dotenv.config();

// Create a bot instance
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Log our bot in
bot.login(process.env.DISCORD_BOT_TOKEN);

//Log to Console
bot.on('ready',() => {
    console.log(`${bot.user.username} is up and running`);
});


//list to user message
bot.on('message',async(message) =>{
    //dont replay if message sent by bot
    if(message.author.bot) 
        return;

    //reply to ping
    if(message.content.startsWith('!ping')) 
        return message.reply('I am working!');
    
    if(message.content.startsWith('!price')){

        //get
        const[command, ...args]=message.content.split(' ');

        //check number of argument
        if (args.length !== 2){
            return message.reply(
                'Please provide the crypto and currency to compare'
            );
        } else {
            const [coin,vsCurrency]=args;
            try{
                //get crypto price from coingecko API
                const{data}= await axios.get(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${vsCurrency}`
                );
                //Check if it exist
                if(!data[coin][vsCurrency]) 
                    throw Error();
                
                return message.reply(
                    `The current price of 1 ${coin} = ${data[coin][vsCurrency]} ${vsCurrency}`
                );
            }
            catch (err) {
                return message.reply(
                    'Please check your inputs again'
                );
            }
        }
    }

    //GET NEWS
    if(message.content.startsWith('!News' || '!news')){
        try {
            const {data}= await axios.get(
                `https://newsapi.org/v2/everything?q=crypto&apiKey=${process.env.NEWS_API_KEY}&pageSize=1&sortBy=publishedAt`
            );

            //Deconstruct data from response
            const{
                title,
                source:{name},
                description,
                url,
            } = data.articles[0];

            return message.reply(
                `Latest News related to Crypto:\n
                Title: ${title}\n
                Description: ${description}\n
                source: ${name}\n
                Link to article: ${url}`
            );
        }
        catch (err) {
            return message.reply('There was error. Please try again');
        }
    }
});

//Reply to !price



