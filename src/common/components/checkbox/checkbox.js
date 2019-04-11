import React, {Component} from "react";

class Cheackbox extends Component{
 render()
 {
     return(
         <div className="checkbox--wrapper">
             <span>
                <label className="label--checkbox">
                  <input
                      type="checkbox"
                      className="checkbox"
                  />
                </label>
              </span>
         </div>
     )
 }
}

export default Cheackbox;