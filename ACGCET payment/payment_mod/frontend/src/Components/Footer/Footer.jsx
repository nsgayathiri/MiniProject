import React from 'react'

import qr from "../../Assets/pictures/qr.png"

import './Footer.css'
import { Link } from 'react-router-dom';
const Footer = () => {
    return (
        <div className="footer">
            <div className="container_footer">
                <div className="row">
                    <div className="sec-aboutus col-lg-3">
                        <p className="first">About Us</p>
                        <p className="moto">We foster to aim for the good and development of our students at any cost.</p>
                        <ul className="sci">
                            <li><a href="https://www.instagram.com/iic_acgcet/"><i className="fa fa-instagram icons" aria-hidden="true" ></i></a></li>
                            <li><a href="https://www.facebook.com/accet/"><i className="fa fa-facebook icons" aria-hidden="true"></i></a></li>
                            <li><a href="https://www.google.com/maps/place/Alagappa+Chettiar+Government+College+of+Engineering+%26+Technology./@10.089863,78.7939322,16.43z/data=!4m5!3m4!1s0x3b0067a028f8a8f9:0x9c2484c6df0fb26!8m2!3d10.090038!4d78.794712"><i className="fa fa-map-marker icons" aria-hidden="true" ></i></a></li>
                        </ul>
                        <Link to="/webdev-team" className="maintained">Developed & Maintained by CSE students</Link>
                    </div>
                    <div className="sec quicklinks col-lg-3">
                        <p className="first">Disclosure</p>
                        <ul>
                            <li><a href="/rti">RTI</a></li>
                            <li><a href="/nba">NBA</a></li>
                            <li><a href="/naac" target='blank' rel='noopener noreferrer' media='print'>NAAC</a></li>
                            <li><a href="/aicte">AICTE</a></li>
                            <li><a href="https://drive.google.com/file/d/1ZwueQyjgqkqhmbY2-I2G972QQ7TY4urz/view?usp=drive_link" target='blank' rel='noopener noreferrer' media='print'>Affliation</a></li>
                            <li><a href="/autonomous">Autonomous</a></li>
                            {/* <li><a href="https://drive.google.com/file/d/1s2O5gv3ZY_UFnatRDD-tI1OodPEEI864/view?usp=drive_link" target='blank' rel='noopener noreferrer' media='print'>Autonomous</a></li> */}
                            <li><a href="https://drive.google.com/file/d/15XA3lz_0XbcLafIkk5V3IqsXkA-lVG6W/view?usp=drive_link" target='blank' rel='noopener noreferrer' media='print'>Fire Service License</a></li>
                            <li><a href="https://drive.google.com/file/d/1UgGpqWhJyy6stEmUQgu_4TOLEhPqDqlG/view?usp=drive_link" target='blank' rel='noopener noreferrer' media='print'>Occupancy Certificate</a></li>
                            <li><a href="https://drive.google.com/file/d/1ryOwfK8ryUbldT_peyqWiCZgBqiyFIoN/view?usp=drive_link" target='blank' rel='noopener noreferrer' media='print'>Structural Stability Certificate</a></li>
                        </ul>
                    </div>
                    <div className="sec quicklinks col-lg-3">
                        <p className="first">Attachments</p>
                        <ul>
                            <li><a href="https://drive.google.com/file/d/15Qmckh-4q0tH5kPdludd8HNTp5BdNYaZ/view?usp=drive_link" target='blank' rel='noopener noreferrer' media='print'>TEQIP</a></li>
                            {/* <li><a href="https://drive.google.com/file/d/1-DdofEfKjhRdTFNcbrYHbHP7LtdCOcek/view?usp=drive_link" target='blank' rel='noopener noreferrer' media='print'>ARIIA</a></li> */}
                            <li><a href="/audit_stmt"  rel='noopener noreferrer' media='print'>Audit Statement</a></li>
                            <li><a href="https://drive.google.com/file/d/1LpmkLiKlGX6ZI1dQ_g_Z2N19G34U3kqY/view?usp=drive_link" target='blank' rel='noopener noreferrer' media='print'>Code of Conduct</a></li>
                            <li><a href="https://drive.google.com/file/d/1tJM-F8JBMAuM2Z4XFIT4y9dvMX3BgQ10/view?usp=drive_link" target='blank' rel='noopener noreferrer' media='print'>Employees Service rules</a></li>
                            <li><a href="https://drive.google.com/file/d/1KpmEBZJpcjcCSGQFWnZ09wM7hnSzpoxV/view?usp=drive_link" target='blank' rel='noopener noreferrer' media='print'>Women's Helpline Number</a></li>
                            <li><a href="https://drive.google.com/file/d/1sLXzf0tIDblbj8EyWSxcdYl0Am-tyMrW/view?usp=drive_link" target='blank' rel='noopener noreferrer' media='print'>Faculty Appraisal</a></li>
                        </ul>
                    </div>
                    <div className="col-lg-3 sec-contact">
                        <p className="first">Contact Us</p>
                        <ul className="info">
                            <li className="social">
                                <span><i className="fa fa-map-marker icon" aria-hidden="true"></i></span>
                                <span>Alagappa Chettiar Government<br /> College of Engineering and<br /> Technology,<br />
                                    Karaikudi-630003.<br />
                                    Sivagangai, Tamilnadu.</span>
                            </li>
                            <li className="social">
                                <span><i className="fa fa-phone icon" aria-hidden="true"></i></span>
                                <p><a href="tel:04565 224528">04565 224528</a><br />
                                    <a href="tel:224535">224535</a></p>
                            </li>
                            <li className="social">
                                <span><i className="fa fa-envelope-o icon" aria-hidden="true" ></i></span>
                                <p><a href="mailto:accetprincipal@gmail.com" className="ga">accetprincipal@gmail.com</a></p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="copyrights">
                    <div className='rights'>
                      <p className="copy">&#169; 2022-2024 ACGCET, Karaikudi, All rights are reserved</p>
                    </div>
                    <div className='qr_sec'>
                        <div className='qr_pic'>
                            <span><a  href="https://forms.gle/A32S18s8EhCoHrz77"><img className='footer_qr' src={qr} alt="Online Grievance QR Code"/></a></span>
                        </div>
                        <div className='qrtext'>
                           <p><a href="https://forms.gle/A32S18s8EhCoHrz77"> Online Grievance</a></p>
                        </div> 
                    </div>

                    
                </div>
            </div>
        </div>
    );
}

export default Footer