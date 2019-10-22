const chai = require('chai');
const expect = chai.expect;
require('isomorphic-fetch')


    it('should fetch the api and display the kind of media which should be song', async () => {
       
        const api_call = await fetch(`https://itunes.apple.com/search?term=drake&entity=song&limit=10`)
	    const response = await api_call.json()

        const expected = "song"
        expect(response.results[0].kind).to.equal(expected);

    });

