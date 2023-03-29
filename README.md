# apex-prepare-demo
Storage of demo data for the prepare demo script in Apex

When the `Prepare Demo` script is run in Apex, it will load the data from this repository. Each .json file in this repo corresponds to an array of data to insert into the database for the model.

Each `.json` file should be in the format of `{ model: string, data: any[] }`. Utilize insomnia to work on your data until you know it inserts correctly and then update the files here.

The files in this repo must be valid `json` while Insomnia does not mandate that same standard. If you are having problems with a file not working utilize a [JSON Validator](https://jsonlint.com/) to help correct issues.