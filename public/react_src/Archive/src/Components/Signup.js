// import React from 'react'
//
// class Signup extends React.Component{
//     constructor(props)
//     {
//         super(props);
//         this.state = {
//             email: ""
//         };
//         this.handleEmailChange = this.handleEmailChange.bind(this);
//         this.handleSubmit = this.handleSubmit.bind(this);
//     };
//
//     handleSubmit(event) {
//         console.log('Form has been send');
//     }
//
//     handleEmailChange(event) {
//         console.log('Email changed');
//         this.setState({
//             email: event.target.value
//         });
//     }
//
//     render() {
//         return(
//             <div>
//                 <div className="form-group row">
//                     <label htmlFor="example-text-input" className="col-xs-2 col-form-label">Text</label>
//                     <div className="col-xs-10">
//                         <input className="form-control" type="text" defaultValue="Artisanal kale" id="example-text-input" />
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label htmlFor="example-search-input" className="col-xs-2 col-form-label">Search</label>
//                     <div className="col-xs-10">
//                         <input className="form-control" type="search" defaultValue="How do I shoot web" id="example-search-input" />
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label htmlFor="example-email-input" className="col-xs-2 col-form-label">Email</label>
//                     <div className="col-xs-10">
//                         <input className="form-control" type="email" defaultValue="bootstrap@example.com" id="example-email-input" />
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label htmlFor="example-url-input" className="col-xs-2 col-form-label">URL</label>
//                     <div className="col-xs-10">
//                         <input className="form-control" type="url" defaultValue="http://getbootstrap.com" id="example-url-input" />
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label htmlFor="example-tel-input" className="col-xs-2 col-form-label">Telephone</label>
//                     <div className="col-xs-10">
//                         <input className="form-control" type="tel" defaultValue="1-(555)-555-5555" id="example-tel-input" />
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label htmlFor="example-password-input" className="col-xs-2 col-form-label">Password</label>
//                     <div className="col-xs-10">
//                         <input className="form-control" type="password" defaultValue="hunter2" id="example-password-input" />
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label htmlFor="example-number-input" className="col-xs-2 col-form-label">Number</label>
//                     <div className="col-xs-10">
//                         <input className="form-control" type="number" defaultValue={42} id="example-number-input" />
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label htmlFor="example-datetime-local-input" className="col-xs-2 col-form-label">Date and time</label>
//                     <div className="col-xs-10">
//                         <input className="form-control" type="datetime-local" defaultValue="2011-08-19T13:45:00" id="example-datetime-local-input" />
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label htmlFor="example-date-input" className="col-xs-2 col-form-label">Date</label>
//                     <div className="col-xs-10">
//                         <input className="form-control" type="date" defaultValue="2011-08-19" id="example-date-input" />
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label htmlFor="example-month-input" className="col-xs-2 col-form-label">Month</label>
//                     <div className="col-xs-10">
//                         <input className="form-control" type="month" defaultValue="2011-08" id="example-month-input" />
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label htmlFor="example-week-input" className="col-xs-2 col-form-label">Week</label>
//                     <div className="col-xs-10">
//                         <input className="form-control" type="week" defaultValue="2011-W33" id="example-week-input" />
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label htmlFor="example-time-input" className="col-xs-2 col-form-label">Time</label>
//                     <div className="col-xs-10">
//                         <input className="form-control" type="time" defaultValue="13:45:00" id="example-time-input" />
//                     </div>
//                 </div>
//                 <div className="form-group row">
//                     <label htmlFor="example-color-input" className="col-xs-2 col-form-label">Color</label>
//                     <div className="col-xs-10">
//                         <input className="form-control" type="color" defaultValue="#563d7c" id="example-color-input" />
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }
//
// export default Signup
//
// // {/*<form onSubmit={this.handleSubmit}>*/}
// // {/*<input type='text' placeholder="email" value={this.state.email} onChange={this.handleEmailChange}/>*/}
// // {/*<button>Signup</button>*/}
// // {/*</form>*/}