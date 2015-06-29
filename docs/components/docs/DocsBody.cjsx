'use strict'

React = require('react')
ReactCSS = require('reactcss')

{ Container, Grid } = require('../layout')
{ Markdown, Animate } = require('../common')
DocsSidebar = require('./DocsSidebar')

docs = require('../../docs')

sampleComponent = require('../../docs/00-sample-component.md')



module.exports = class DocsBody extends ReactCSS.Component

  state:
    visible: ''
    files: {}
    sidebarFixed: false

  classes: ->
    'default':
      docsBody:
        paddingBottom: '80px'

      content:
        fontSize: '17px'
        lineHeight: '24px'
        color: 'rgba(0,0,0,.47)'

      animate:
        marginTop: '-240px'
        paddingBottom: '40px'

      inner:
        padding: '16px'

      file:
        paddingBottom: '10px'

  componentDidMount: ->
    window.addEventListener('scroll', @onScroll, false);

    files = {}
    for file in React.findDOMNode( @refs.files ).children
      files[file.offsetTop] = file.id

    @setState( files: files )


  componentWillUnmount: ->
    window.removeEventListener('scroll', @onScroll, false);

  onScroll: (e) =>
    @changeSelection()
    @attachSidebar()

  attachSidebar: =>
    sidebarTop = React.findDOMNode( @refs.docsSidebar ).getBoundingClientRect().top

    if sidebarTop <= 0 && @state.sidebarFixed is false
      @setState( sidebarFixed: true )

    if sidebarTop > 0 && @state.sidebarFixed is true
      @setState( sidebarFixed: false )

  changeSelection: =>
    top = document.body.scrollTop - 150
    mostVisible = ''
    for offset, id of @state.files
      if offset < top
        mostVisible = id
    if mostVisible isnt @state.visible
      @setState( visible: mostVisible )


  render: ->
    <div is="docsBody" className="docsBody">
      <Container>
        <Grid uneven flex="1-3">

          <Animate inDelay={ 900 } ref="docsSidebar">
            <DocsSidebar files={ docs } active={ @state.visible } fixed={ @state.sidebarFixed } />
          </Animate>

          <div is="content">

            <Animate inStartTransform="translateY(20px)" inEndTransform="translateY(0)" inDelay={ 400 }>
              <div is="animate">
                <Markdown>{ sampleComponent }</Markdown>
              </div>
            </Animate>

            <div ref="files">

              { for fileName, file of docs
                  regex = /---[\s\S]*?title: (.+)[\s\S]*?---([\s\S]*)/.exec(file)
                  title = regex[1]
                  body = regex[2]
                  id = /id: (.+)/.exec(file)[1]


                  <div key={ fileName } id={ id }>
                    { if fileName.split('-')[0].indexOf('.') is -1
                        <h1>{ title }</h1>
                      else
                        <h2>{ title }</h2> }

                    { if body.trim()
                        <div is="file">
                          <Markdown>{ body }</Markdown>
                        </div> }
                  </div> }
            </div>

          </div>

        </Grid>

      </Container>
    </div>
