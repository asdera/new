import React, { Component } from "react";
import Navbar from "./Navbar";
import Landing from "./landing";
import Sketch from 'react-p5'
import "./projects.css";
import "./Section.css";
import Asu from "./Asu/asu";
import Projects from "./projects";
const aboutMe = require('../images/aboutMe.png');
const aboutMeDark = require('../images/aboutMeDark.png');
const gamesMe = require('../images/gamesMe.png');
const gamesMeDark = require('../images/gamesMeDark.png');
const appsMe = require('../images/appsMe.png');
const appsMeDark = require('../images/appsMeDark.png');
const contactMe = require('../images/contactMe.png');
const contactMeDark = require('../images/contactMeDark.png');

const imagesMe = {
  aboutMe: aboutMe,
  aboutMeDark: aboutMeDark,
  gamesMe: gamesMe,
  gamesMeDark: gamesMeDark,
  appsMe: appsMe,
  appsMeDark: appsMeDark,
  contactMe: contactMe,
  contactMeDark: contactMeDark
}

export default class Section extends Component {
  constructor(props) {
      super(props);
      this.state = { 
        dark: this.props.dark,
        more: this.props.more 
      };
      this.handleClick = this.handleClick.bind(this);
      this.lighting = this.lighting.bind(this);
  }

  setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth/2, window.innerHeight).parent(canvasParentRef)
    // p5.resizeCanvas(500, 500);
    p5.canvas.style.width = "100%";
    p5.canvas.style.height = "100%";
    var squeeze = p5.min(p5.width*0.7, p5.height*0.5);
    this.pix = squeeze/20;
    this.display = {
        x: p5.width/2-this.pix*(this.props.id.length*1.5 + 1.5),
        y: p5.height*0.1,
    }
    

    this.p5 = p5;
    this.title = new Asu(p5, this.pix, this.display, false);

    this.f = 0;
    
    this.bColor = {
      "about": p5.color(60, 10, 10),
      "games": p5.color(10, 60, 10),
      "apps": p5.color(10, 10, 60), 
      "contact": p5.color(25, 25, 25)
    }[this.props.id]

    this.color = {
      "about": p5.color(248, 102, 175),
      "games": p5.color(102, 248, 175),
      "apps": p5.color(102, 175, 248), 
      "contact": p5.color(230, 230, 230)
    }[this.props.id]
    
    // console.log(this.color, this.props.id);

    this.flash = 1;
    this.select = 0;
    this.x = 50
    this.y = 50
    this.dark = this.state.dark;
      
  }

  draw = p5 => {
    p5.background(this.dark ? this.bColor : this.color);
    this.f++;
    
    if (this.f === 30) {
        this.title.wordo(p5, this.props.title);
    }

    this.title.update(p5, this.dark, this.dark ? 255 : 0);

    p5.noFill();
    p5.stroke(this.dark ? this.color : this.bColor);
    p5.strokeWeight(12);
    p5.line(this.display.x, this.display.y + this.pix*7, this.display.x + 2*(p5.width/2 - this.display.x), this.display.y + this.pix*7);
  
    p5.push();
    p5.noStroke();
    var dent = this.pix*2/3
    p5.fill(72, 18)
    p5.quad(0, 0, p5.width, 0, p5.width-dent, dent, dent, dent);
    p5.fill(72, 16)
    p5.quad(p5.width, 0, p5.width-dent, dent, p5.width-dent, p5.height-dent, p5.width, p5.height);
    p5.fill(72, 12)
    p5.quad(dent, p5.height-dent, 0, p5.height, p5.width, p5.height, p5.width-dent, p5.height-dent);
    p5.fill(72, 10)
    p5.quad(dent, p5.height-dent, 0, p5.height, 0, 0, dent, dent);
    p5.pop();
  }

  handleClick() {
    if (this.p5.abs(this.display.y + this.pix*7 - this.p5.mouseY) < 6) {
      this.dark = !this.dark;
      this.lighting(this.dark);
    }
  }

  lighting(d) {
    this.setState({
      dark: d
    })
  }

  viewLink = (to) => {
    var win = window.open(to, '_blank');
    win.focus();
  }

  viewMore = (to) => {
    this.setState({
      more: !this.state.more,
    })
  }

  render() {
    const colour = this.state.dark ? "colour-dark" : "colour-light";
    const colour1 = !this.state.dark ? "colour-dark" : "colour-light";
    var projs = Projects[this.props.id];
    var projsDisplay;
    const showLess = 3;

    if (projs) {
      if (!this.state.more && projs.length > showLess + 3) {
        projsDisplay = projs.slice(0, showLess);
      } else {
        projsDisplay = projs;
      }
    } 

    return (
      <div className={"section section-" + this.props.id}>
        
        {this.props.id === "landing" ? (
          <Landing 
            dark = {this.state.dark}
            lighting = {this.lighting}
          />
        ) : (
          <div className="section-container" id={this.props.id}>
            <div className="section-half section-details" onClick={this.handleClick}>
              <Sketch setup={this.setup} draw={this.draw} preload={this.preload} windowResized={this.windowResized}/>
              <div className="section-info">
                <h1 className={colour}>{this.props.title}</h1>
                <p className={colour}>
                  {this.props.subtitle}
                  {this.props.id === "about" && <a href={'https://asdera.github.io/Resume/AW%20RESUME.pdf'}>Resume.</a>}
                </p>
                <div className="section-drop">
                  <img src={imagesMe[this.props.id + "Me" + (this.state.dark ? "Dark" : "")]} alt=""/>
                </div>
              </div>
              <Navbar dark = {this.state.dark}/>
            </div>
            <div className="section-half section-content">
              {projsDisplay && (projsDisplay.map((project, index) => {
                return (
                  <div className="project" key={index} id={project.id} onClick={() => this.viewLink(project.to)}>
                    <div className={"project-fade project-" + colour1}>
                      <div className="project-inner">
                        <div className={colour1 + " project-title"}>
                          <h1>{project.name}</h1>
                        </div>
                        <div className={colour1 + " project-info"}>
                          <p>{project.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }))}
              {(!this.state.more && projs.length > showLess + 3) && (
                <div className="project" key={showLess} id="more" onClick={this.viewMore}>
                  <div className="project-split" id={projs[showLess].id}></div>
                  <div className="project-split" id={projs[showLess+1].id}></div>
                  <div className="project-split" id={projs[showLess+2].id}></div>
                  <div className="project-split" id={projs[showLess+3].id}></div>
                  <div className={"project-extra project-fade project-" + colour1}>
                    <div className="project-inner">
                      <div className={colour1 + " project-title"}>
                        <h1>View More .  .  .</h1>
                      </div>
                      <div className={colour1 + " project-info"}>
                        {/* <h1>View More .  .  .</h1> */}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div style={{clear: "both"}}></div>
      </div>
    );
  }
}


