import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import './center-text.css'

const CenterText = (props) => {
  return (
    <div className={`center-text-center-text ${props.rootClassName} `}>
      <span className="center-text-text1">
        {props.text ?? (
          <Fragment>
            <span className="center-text-text2">This Is Us</span>
          </Fragment>
        )}
      </span>
    </div>
  )
}

CenterText.defaultProps = {
  rootClassName: '',
  text: undefined,
}

CenterText.propTypes = {
  rootClassName: PropTypes.string,
  text: PropTypes.element,
}

export default CenterText
