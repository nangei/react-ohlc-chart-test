import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Loading from './components/Loading';
import OHLCChart from './components/OHLCChart';

const BASEURL = 'https://www.alphavantage.co';
const APIKEY = 'LFH3KUHR9XT527JH';  //O108979P5I3NH4NV

const App = () => {
  //state
  const [companyName, setCompanyName] = useState([])
  const [resultData, setResultData] = useState([])
  const [searchQuery, setSearchQuery ] = useState('BA');
  const [symbol, setSymbol] = useState('BA');
  const [url, setUrl] = useState(`${BASEURL}/query?function=SYMBOL_SEARCH&keywords=${searchQuery}&apikey=${APIKEY}`);
  const [chartDataurl, setChartDataUrl] = useState(`${BASEURL}/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${APIKEY}`);

  const [loading, setLoading] = useState(false);
  const [callback, setCallback] = useState(false);
  const [initIntro, setInitIntro] = useState("Please key in the company name into the search box, the relative company lists will appear on the left side of the sub menu. After that choose the sub menu that you want to view the OHLC chart.");
  
  //fetch Company Name
  const fetchComName = () => {
    //set loading true
    setLoading(true)
    fetch(url)
    .then(result => result.json()) 
    .then(data => (setCompanyName(data.bestMatches), setLoading(false)))
    .catch(error => console.log(error))
  };

  const fetchResults = () => {
    //set loading true
    setLoading(true)
    if(chartDataurl !== '') {
      fetch(chartDataurl)
      .then(resultdata => resultdata.json())
      // .then(data => console.log(data['Time Series (Daily)']))
      .then(createdata => (setResultData(createdata), setLoading(false)))
      .catch(error => console.log(error))
    }
  };

  useEffect(() => {
    if(searchQuery !== ''){
      fetchComName()
    }
  }, [url])

  const handleChange = e => {
    setSearchQuery(e.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault();
    {showLoading()}
    setUrl(`${BASEURL}/query?function=SYMBOL_SEARCH&keywords=${searchQuery}&apikey=${APIKEY}`);
    setChartDataUrl('');
    setCallback(false);
    setInitIntro("Please select the sub menu that you want to view the OHLC chart.");
  }

  useEffect(() => {
    fetchResults()
  }, [chartDataurl])

  const handleDataChange = (sym) => {
      setSearchQuery(sym)
      setChartDataUrl(`${BASEURL}/query?function=TIME_SERIES_DAILY&symbol=${sym}&apikey=${APIKEY}`);
      setCallback(true);
      setInitIntro('');
  };

  const searchForm = () => (
    <form className="form-inline" onSubmit={handleSubmit}>
      <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" value={searchQuery} onChange={handleChange}/>
      <button className="btn btn-outline-info my-2 my-sm-0" type="submit">Search</button>
    </form>
  );

  const activeLink = (act) => {
    if(act == searchQuery){
      return 'active';
    }
  }

  const showLoading = () => loading ? <div className="loading-wrapper"><Loading /></div> : "";
  const showNav = () => companyName != '' && companyName !== undefined ? companyName.map((n,i) => <a className={`nav-link ${activeLink(n['1. symbol'])}`} id="v-pills-home-tab" data-toggle="pill" href="#" role="tab" aria-selected="true" key={i} onClick={() => handleDataChange(n['1. symbol'])}> {n['1. symbol'] + ' - ' + n['2. name']}</a>) : 'Sorry! The data cannot be retrive. Please try to search another keywords.' ;

  const showData = () => companyName != '' && !loading && callback && resultData !== '' ? <OHLCChart data={resultData}/> : initIntro ;

  
  const footer = () => (
    !loading ? <footer className="">
      <div className="footer-copyright text-center py-3">
        <small>© 2019 Copyright:
          <a href="#"> example.com</a>
        </small>
      </div>
    </footer> : ""
  );

  return (
    <div>
      <header>
          <nav className="navbar navbar-dark bg-dark">
             <a className="navbar-brand" href="#">
              OHLC Chart
            </a>
            {searchForm()}
         </nav>
      </header>
      <div className="container">
        <div className="border-bottom">
          <div className="row mt-5 mb-5 ">
            <div className="col-md-3 nav-wrapper">
              <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                {showNav()}
              </div>
            </div>
            <div className="col-md-9">
              {showLoading()}
              {showData()}
            </div>
          </div>
        </div>
      </div>
      {footer()}
    </div>
  )
}

export default App;
