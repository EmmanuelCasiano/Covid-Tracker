const casesCount = document.querySelectorAll('.cases');
const speed = 100; // The lower the slower


const search = document.getElementById('search');
const matchList = document.getElementById('match-list');
const countryHeading = document.getElementById('countryHeading');

const confirmed = document.getElementById('confirm');
const active = document.getElementById('active');
const recovered = document.getElementById('recovered');
const deaths = document.getElementById('deaths');



// Search API and filter 
    const searchCountry = async searchText => {
    const res = await fetch('https://api.covid19api.com/countries');
    const countries = await res.json();


    

    let matches = countries.filter(countryList => {
        const regex = new RegExp(`^${searchText}`, 'gi');
        return countryList.Country.match(regex) || countryList.ISO2.match(regex);
    });

     outputHtml(matches);




};

const outputHtml = matches => {
    if(matches.length > 0) {
        const html = matches.map(match => `
            <div class="card card-body search-result" data-countryName="${match.Country}">
                <h6>${match.Country} | <span class="text-primary">${match.ISO2}</span></h6>
            </div>
        `).join('');

        matchList.innerHTML = html;
    }


}


    const showWorldCases = async searchText => {
    const res = await fetch('https://api.covid19api.com/summary');
    const data = await res.json();

        let activeCases = data.Global.TotalConfirmed - ( data.Global.TotalDeaths + data.Global.TotalRecovered );


        var data1 = document.querySelectorAll('.cases')[0];
        data1.setAttribute('data-cases', data.Global.TotalConfirmed);

        var data2 = document.querySelectorAll('.cases')[1];
        data2.setAttribute('data-cases', activeCases);

        var data3 = document.querySelectorAll('.cases')[2];
        data3.setAttribute('data-cases', data.Global.TotalRecovered);

        var data4 = document.querySelectorAll('.cases')[3];
        data4.setAttribute('data-cases', data.Global.TotalDeaths);  
        animateCaseNumbers();
};


function getCountryDataByName(countryName) {
    fetch(`https://api.covid19api.com/summary`)
    .then(res => res.json())
    .then(data => {
        //  console.log(countryName);

                var data1 = document.querySelectorAll('.cases')[0];
                data1.setAttribute('data-cases', 0);

                var data2 = document.querySelectorAll('.cases')[1];
                data2.setAttribute('data-cases', 0);

                var data3 = document.querySelectorAll('.cases')[2];
                data3.setAttribute('data-cases', 0);

                var data4 = document.querySelectorAll('.cases')[3];
                data4.setAttribute('data-cases', 0);

        countryHeading.innerHTML = countryName+' <span class="btn btn-danger btn-sm px-1 py-0">has no data.</span>';

        data.Countries.forEach(item =>{
            if(countryName === item.Country){
                countryFlag = "<img src=\"https://www.countryflagicons.com/FLAT/32/"+item.CountryCode+".png\">";

                let activeCases = item.TotalConfirmed - ( item.TotalDeaths + item.TotalRecovered );

                var data1 = document.querySelectorAll('.cases')[0];
                data1.setAttribute('data-cases', item.TotalConfirmed);
        
                var data2 = document.querySelectorAll('.cases')[1];
                data2.setAttribute('data-cases', activeCases);
        
                var data3 = document.querySelectorAll('.cases')[2];
                data3.setAttribute('data-cases', item.TotalRecovered);
        
                var data4 = document.querySelectorAll('.cases')[3];
                data4.setAttribute('data-cases', item.TotalDeaths);


                countryHeading.innerHTML = countryName +' | '+ countryFlag;
            } 
        });
        animateCaseNumbers();
    });
    
}

    loadTopCountries();
    searchCountry();
    showWorldCases();
    search.addEventListener('input', () => searchCountry(search.value));


    // Show search click result 
    matchList.addEventListener('click', e => {
        const dataTag = e.target.tagName;

        // console.log(dataTag)

        if(dataTag == 'DIV'){
            const clickedCountry = e.target;
            const countryName = clickedCountry.getAttribute('data-countryname');
            getCountryDataByName(countryName);

        }else if(dataTag == 'H6'){
            const clickedCountry = e.target.parentElement;

            const countryName = clickedCountry.getAttribute('data-countryname');
            getCountryDataByName(countryName);

        }else if(dataTag == 'SPAN'){
            const clickedCountry = e.target.parentElement.parentElement;

            const countryName = clickedCountry.getAttribute('data-countryname');
            getCountryDataByName(countryName);

        }

        matchList.innerHTML = '';
        search.value = '';

    });



    
// Animate Case Figures
function animateCaseNumbers(){
    casesCount.forEach(counter => {
        counter.innerText = 0; // reset data in order to animate after having big numbers
        const updateCount = () => {
            counter.innerText = counter.innerText.replace(/,/g, ''); // remove the commas after loop
            const target = +counter.getAttribute('data-cases');
            const count = +counter.innerText;



            // console.log(count);

            // Lower inc to slow and higher to slow
            const inc = target / speed;

            // Check if target is reached
            if (count < target) {
                // Add inc to count and output in counter .toLocaleString()
                animatedNumber = Math.ceil(count + inc);
                counter.innerText = animatedNumber.toLocaleString();
                // Call function every ms
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target.toLocaleString();
                
            }

        
        };

	updateCount();
});


}


function loadTopCountries() {
    fetch(`https://api.covid19api.com/summary`)
    .then(res => res.json())
    .then(data => {

        data.Countries.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);


        var row = "";
        let newNum = 0;
        for(let i = 0; i < 10; i++){
            
                newNum +=1;
            row += 
            `
                <tr>
                    <td>${newNum}</td>
                    <td><img src="https://www.countryflagicons.com/FLAT/32/${data.Countries[i].CountryCode}.png"> <strong>${data.Countries[i].Country}</strong></td>
                    <td>${data.Countries[i].TotalConfirmed.toLocaleString()}</td>
                    <td>${data.Countries[i].TotalRecovered.toLocaleString()}</td>
                    <td>${data.Countries[i].TotalDeaths.toLocaleString()}</td>
                </tr>
            `;
            // table_countries_body.innerHTML +=row;
            document.querySelector('#table-countries').innerHTML = row;
    }

    });
}

