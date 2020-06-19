import React from "react"
import { Router } from "@reach/router"

import Products from "../domain/products"
import Layout from "../components/layout"
import SEO from "../components/seo"
import InputField from "../components/input"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <div>hi index</div>
  </Layout>
)

export default IndexPage