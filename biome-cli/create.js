/**
 * create.js
 * @author Wilfredo Pacheco, Logan Bunker
 */

const fs = require('fs');
const prompts = require('prompts');
var colors = require('colors');

const CLI_DIRECTORY = 'biome-cli';  // CLI Root Directory;
const VIEWS_DIRECTORY = 'Views';    // Views Directory;

/** Get any arguments passed from the command line; */
const [ cmd_requested, name ] = process.argv.slice(2);

const create = {
    file(filename, content){
        fs.writeFile(filename, content, function (err, file) {
            if (err) throw err;
        });
    },
    async directory(folderName){
        console.info(`Creating ${folderName}...`);
        try 
        {
            if (!fs.existsSync(folderName))
            {
                fs.mkdirSync(folderName);
                return folderName;
            }
            else
            {
                console.info(`The ${folderName} already exists!`);
                // const response = prompt(`The ${folderName} already exists, would you like to replace it? `);
                // if(response && response.toLocaleLowerCase().includes('y'))
                // {
                //     // TODO: Delete directory and re-create the folder;
                //     // right?
                //     fs.mkdirSync(folderName);
                //     return folderName;
                // }
                // console.info(response);
            }
        }
        catch (err) {
            console.error(err);
        }
    },
    async view({ name, file_name, template_name }){
        // const VIEWS_DIRECTORY = 'Views';    // Views Directory;
        fs.readFile(`./${CLI_DIRECTORY}/templates/${template_name}.js`, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const content = data.replace(/<<TITLE>>/gi, name);
            create.file(`${VIEWS_DIRECTORY}/${name}/${file_name}.js`, content);
        });
    },
    async class({ name, file_name, template_name }){
        const CLASS_DIRECTORY = 'src/Classes';
        fs.readFile(`./${CLI_DIRECTORY}/templates/${template_name}.js`, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const content = data.replace(/TITLE/gi, name);
            create.file(`${CLASS_DIRECTORY}/${file_name}.js`, content);
        });
    },
}

const choices = [
    { title: 'View', value: 'view' },
    { title: 'Class', value: 'class' },
    // { title: 'Directory', value: 'directory' },
];

const cmds = [{
    title: 'view',
    async init(name){
        
        if (!name) name = await prompts({
            type: 'text',
            name: 'value',
            message: 'What would you like to call this view? ',
        })
        .then(response => response.value);

        if (!name) console.info('A name is required to continue! Please try again.');
        else
        {
            await create.directory(VIEWS_DIRECTORY);

            // Create the directory;
            const directory = await create.directory(`${VIEWS_DIRECTORY}/${name}`);
            
            // Create the view, list, post, patch, form Javascript Files;
            if (directory)
            {
                await create.view({
                    name,
                    file_name: 'List',
                    template_name: 'template-list',
                });

                await create.view({
                    name,
                    file_name: 'View',
                    template_name: 'template-view',
                });

                await create.view({
                    name,
                    file_name: 'Post',
                    template_name: 'template-post',
                });

                await create.view({
                    name,
                    file_name: 'Patch',
                    template_name: 'template-patch',
                });

                await create.view({
                    name,
                    file_name: 'Form',
                    template_name: 'template-form',
                });

            
                console.info(`Successfully created ${name}!`.green);
                console.info(`NOTE: Don't forget to add ${
                    name
                } to app.settings.js & app.render.js for Biome-js to auto-create and render the view.`.yellow);
                // console.log('i like cake and pies'.underline.red) // outputs red underlined text
                // console.log('inverse the color'.inverse); // inverses the color
                // console.log('OMG Rainbows!'.rainbow); // rainbow
                // console.log('Run the trap'.trap); // Drops the bass
            }
        }
    },
},{
    title: 'class',
    async init(name){
        
        if (!name) name = await prompts({
            type: 'text',
            name: 'value',
            message: 'What would you like to call this class? ',
        })
        .then(response => response.value);

        if (!name) console.info('A name is required to continue! Please try again.');
        else
        {
            // console.info(`Creating ${name} class...`);
            // Create the view, list, post, patch, form Javascript Files;
            await create.class({
                name,
                file_name: name,
                template_name: 'template-class',
            });

            console.info(`Successfully created ${name}!`.green);
            // console.log('This could be the next $$$ money maker!'.rainbow); // rainbow
            // console.log('It might be time for a coffee break!'.rainbow); // rainbow
        }
    },
// },{
//     title: 'directory',
//     async init(name){
        
//         if (!name) name = await prompts({
//             type: 'text',
//             name: 'value',
//             message: 'What would you like to call this class? ',
//         })
//         .then(response => response.value);

//         if (!name) console.info('A name is required to continue! Please try again.');
//         else
//         {
//             // console.info(`Creating ${name} class...`);
//             // Create the view, list, post, patch, form Javascript Files;
//             await create.class({
//                 name,
//                 file_name: name,
//                 template_name: 'template-class',
//             });

//             console.info(`Successfully created ${name}!`.green);
//             // console.log('This could be the next $$$ money maker!'.rainbow); // rainbow
//             // console.log('It might be time for a coffee break!'.rainbow); // rainbow
//         }
//     },
}];

function findCommand(requested_cmd){
    return cmds.find(c => c.title === requested_cmd.toLocaleLowerCase());
}

async function init(){
    if (!cmd_requested)
    {
        const response = await prompts({
            type: 'select',
            name: 'value',
            message: 'What would you like to create? ',
            choices,
          })
        .then(response => response.value);
        if (!response) console.info('A response is required to continue!');
        else
        {
            const request = response.toLocaleLowerCase();
            const cmd = findCommand(request);
            if (!cmd) console.info('This is an invalid request!');
            else cmd.init();
        }
    }

    else
    {
        const request = cmd_requested.toLocaleLowerCase();
        const cmd = findCommand(request);
        if (!cmd) console.info('This is an invalid request!');
        else cmd.init(name);
    }
}

init();