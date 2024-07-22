import React from "react";
import BlogMain from "../reusable/BlogMain";
import becomeTeacherImage from "../assets/becomeTeacher.jpg";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";

export default function Blogs() {
    return (
        <div className="blog w-100 p-5">
            <div className="blog-content w-100">
                <div className="blog-content-title w-100">
                    <div className="w-100 text-center">
                        <h1 className="fw-bold">
                            The Art of Custom Jewelry Process: A
                        </h1>
                        <h1 className="fw-bold">Step-by-Step Guide</h1>
                    </div>
                    <div className="w-100 text-center">
                        <span className="text-secondary m-2">31 May 2024</span>
                        <span className="m-2 text-decoration-underline text-secondary">
                            Uncategorized
                        </span>
                    </div>
                </div>
                <div className="blog-content-img1 w-100 d-flex justify-content-center align-items-center">
                    <div className="w-75">
                        <img
                            src="https://customjewelry.com/wp-content/uploads/2024/05/Custom-Design-Process-Step-43DWaxModel.jpg"
                            alt=""
                        />
                    </div>
                </div>
                <div className="blog-content-info-img1 w-100 d-flex justify-content-center align-items-center">
                    <div className="w-50 text-secondary">
                        <p>
                            Embarking on the creation of custom jewelry process
                            is an exciting journey that allows you to bring your
                            unique vision to life. At www.customjewelry.com, we
                            ensure that each step of the process is seamless,
                            engaging, and ultimately rewarding. Here’s how we
                            help you craft your dream piece of jewelry, from the
                            initial concept to the final polish.
                        </p>
                    </div>
                </div>
                <div className="blog-content-title2 w-100 d-flex justify-content-center align-items-center">
                    <div className="w-50 ">
                        <div>
                            <h1 className="fw-bold mt-5 ">
                                Custom Jewelry Process
                            </h1>
                        </div>
                        <div>
                            <h2 className="mt-3">
                                Step 1: Design Consultation
                            </h2>
                        </div>
                        <div className="w-100 d-flex justify-content-center align-items-center mt-5">
                            <img
                                className="w-75"
                                src="https://customjewelry.com/wp-content/uploads/2024/05/custom-jewelry-process-design.jpg"
                                alt=""
                            />
                        </div>
                        <div className="mt-5">
                            <p className="text-secondary">
                                Your custom jewelry journey begins with an
                                inspiration that sparks your desire for a
                                bespoke piece. At CustomJewelry.com, the process
                                kicks off with a design consultation, where you
                                can connect with expert designers via phone,
                                video call, or email. This stage is all about
                                understanding your vision, discussing your style
                                preferences, and setting a project scope that
                                respects your budget and timeline.
                            </p>
                        </div>
                        <div>
                            <h2>Step 2: Sketch and Artwork</h2>
                        </div>
                        <div className="w-100 d-flex justify-content-center align-items-center mt-5">
                            <img
                                className="w-75"
                                src="https://customjewelry.com/wp-content/uploads/2024/05/Custom-Jewelry-Process-Counter-Sketch-to-Scale.png"
                                alt=""
                            />
                        </div>
                        <div className="mt-5">
                            <div className="text-secondary">
                                <p>
                                    Our talented designers then translate your
                                    ideas into a detailed sketch, providing a
                                    visual representation of your final piece.
                                    This sketch serves as the blueprint for your
                                    custom jewelry.
                                </p>
                                <p className="mt-4">
                                    Once we have a clear understanding of your
                                    vision, our designers begin crafting
                                    preliminary sketches. This stage is highly
                                    collaborative; we encourage feedback to
                                    refine the design. Clients are involved
                                    throughout this process, making choices on
                                    everything from the shape to the intricate
                                    details that will make the piece uniquely
                                    theirs.
                                </p>
                            </div>
                        </div>
                        <div>
                            <h2>Step 3: Computer-Aided Design (CAD)</h2>
                        </div>
                        <div className="w-100 d-flex justify-content-center align-items-center mt-5">
                            <img
                                className="w-50"
                                src="https://customjewelry.com/wp-content/uploads/2024/05/Custom-Jewelry-Process-CAD-jewerly.png"
                                alt=""
                            />
                        </div>
                        <div className="mt-5">
                            <p className="text-secondary">
                                Following your approval of the sketch, we use
                                state-of-the-art CAD technology to create a
                                precise 3D virtual model. This model allows you
                                to visualize and adjust your design before it
                                comes to life.
                            </p>
                        </div>
                        <div>
                            <h2>Step 4: Wax Model and Casting</h2>
                        </div>
                        <div className="w-100 d-flex justify-content-center align-items-center mt-5">
                            <img
                                className="w-50"
                                src="https://customjewelry.com/wp-content/uploads/2024/05/Custom-Design-Process-Step-43DWaxModel-1.jpg"
                                alt=""
                            />
                        </div>
                        <div className="mt-5">
                            <p className="text-secondary">
                                Once the virtual has been approved, a detailed
                                wax model is crafted, offering a tangible
                                preview if needed before proceeding with the
                                precious metal cast.
                            </p>
                        </div>
                        <div>
                            <h2>Step 5: Detailed Crafting</h2>
                        </div>
                        <div className="w-100 d-flex justify-content-center align-items-center mt-5">
                            <img
                                className="w-50"
                                src="https://customjewelry.com/wp-content/uploads/2024/05/Custom-Jewelry-Process-Fabrication.png"
                                alt=""
                            />
                        </div>
                        <div className="mt-5">
                            <p className="text-secondary">
                                Our expert craftsmen meticulously handcraft your
                                jewelry’s casting, setting, assembly and
                                finishing. Whether it involves intricate hand
                                engravings or setting delicate stones, every
                                step is done with precision.
                            </p>
                        </div>
                        <div>
                            <h2>Step 6: Final Touches and Delivery</h2>
                        </div>
                        <div className="w-100 d-flex justify-content-center align-items-center mt-5">
                            <img
                                className="w-50"
                                src="https://customjewelry.com/wp-content/uploads/2024/05/Custom-Jewelry-Process-Final-Ring-1024x1024.jpg"
                                alt=""
                            />
                        </div>
                        <div className="mt-5 mb-5">
                            <p className="text-secondary">
                                Once your jewelry is complete, it undergoes a
                                final inspection to ensure it meets our high
                                standards. Then, it’s carefully packaged and
                                shipped to you, ready to be cherished and
                                enjoyed for a lifetime
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-8"></div>
                    <div className="fw-bold col-4">#Design Process</div>
                    <div className="col-12 row">
                        <div className="col-3"></div>
                        <div className="col-6">
                            <hr />
                        </div>
                        <div className="col-3"></div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3 "></div>
                    <div className="col-6">
                        <div className="d-flex justify-content-around align-items-center">
                            <div className="p-1">SHARE:</div>
                            <div className="border rounded-circle p-1">
                                <a>
                                    <i class="bi bi-facebook"></i>
                                </a>
                            </div>
                            <div className="border rounded-circle p-1">
                                <a>
                                    <i class="bi bi-twitter"></i>
                                </a>
                            </div>
                            <div className="border rounded-circle p-1">
                                <a>
                                    <i class="bi bi-instagram"></i>
                                </a>
                            </div>
                            <div className="border rounded-circle p-1">
                                <a>
                                    <i class="bi bi-threads-fill"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
                <div className="row mt-5">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <div>
                            <h4 className="fw-bold">Leave a Reply</h4>
                        </div>
                        <div>
                            <p className="text-secondary">
                                Your email address will not be published.
                                Required fields are marked *
                            </p>
                        </div>
                        <div>
                            <textarea
                                class="form-control"
                                id="exampleFormControlTextarea1"
                                rows="3"
                                placeholder="Comment*"
                            ></textarea>
                        </div>
                        <div className="w-100 d-flex justify-content-around align-items-center mt-2 ">
                            <div className="w-25">
                                <input
                                    class="form-control"
                                    type="text"
                                    placeholder="Name"
                                    aria-label="default input example"
                                />
                            </div>
                            <div className="w-25">
                                <input
                                    class="form-control"
                                    type="text"
                                    placeholder="Emai*"
                                    aria-label="default input example"
                                />
                            </div>
                            <div className="w-25">
                                <input
                                    class="form-control"
                                    type="text"
                                    placeholder="Website"
                                    aria-label="default input example"
                                />
                            </div>
                        </div>
                        <div className="w-100 d-flex justify-content-around align-items-center mt-5">
                            <input type="checkbox" />
                        </div>
                        <div className="mt-5">
                            <p className="text-secondary">
                                Save my name, email, and website in this browser
                                for the next time I comment.
                            </p>
                        </div>
                        <div>
                        <button type="button" class="btn btn-light border mt-3">Submit</button>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
            </div>
        </div>
    );
}
