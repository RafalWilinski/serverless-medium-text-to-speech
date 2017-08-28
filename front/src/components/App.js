import React, { Component } from "react";
import styled from "styled-components";
import Spinner from "react-spinkit";
import "../styles/App.css";

const apiUrl = process.env.REACT_APP_API_URL;

const Container = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Title = styled.h2`text-align: center;`;

const Input = styled.input`
  width: 100%;
  padding: 3px 8px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1em;
  border: 0;
  outline: 0;
`;

const Button = styled.button`
  font-size: 1em;
  padding: 10px 20px;
  border: 2px solid black;
  background: transparent;
  outline: 0;

  &:hover {
    background: black;
    color: white;
  }
`;

const FooterLinks = styled.div`
  position: absolute;
  display: flex;
  bottom: 10px;
  > a {
    color: #22ac77;
    margin: 0 10px;
  }
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false
    };
  }

  componentDidMount() {
    this.input.focus();
  }

  fetchSpeech = () => {
    this.setState({ isFetching: true });

    fetch(apiUrl, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ href: this.input.value })
    })
      .then(response => response.json())
      .then(json => {
        this.setState({
          isFetching: false,
          audioFile: json.location
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  renderActionElement = () => {
    if (this.state.isFetching) {
      return <Spinner name="wave" />;
    }

    if (this.state.audioFile) {
      return (
        <audio controls>
          <source src={this.state.audioFile} type="audio/mpeg" />
          Your browser does not support the MP3 😭
        </audio>
      );
    }

    return <Button onClick={this.fetchSpeech}>Tell me a story</Button>;
  };

  render() {
    return (
      <Container>
        <Title>Serverless, Text-to-speech service for Medium stories</Title>
        <Input
          type="url"
          placeholder="Paste Medium story URL"
          innerRef={r => (this.input = r)}
        />
        {this.renderActionElement()}
        <FooterLinks>
          <a
            href="https://twitter.com/RafalWilinski"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          •
          <a
            href="https://github.com/RafalWilinski/serverless-medium-text-to-speech"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
        </FooterLinks>
      </Container>
    );
  }
}

export default App;
